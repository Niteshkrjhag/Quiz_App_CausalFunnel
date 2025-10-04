import json
import requests
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from .models import QuizUser, QuizResult
from .forms import QuizUserForm

def index(request):
    """Start page with email input form"""
    if request.method == 'POST':
        form = QuizUserForm(request.POST)
        if form.is_valid():
            # Either get existing user or create new one
            email = form.cleaned_data['email']
            user, created = QuizUser.objects.get_or_create(email=email)
            
            # Store user email in session
            request.session['user_email'] = email
            
            # Fetch questions and store in session
            try:
                response = requests.get('https://opentdb.com/api.php?amount=15')
                data = response.json()
                
                if data['response_code'] == 0:
                    request.session['quiz_questions'] = data['results']
                    request.session['start_time'] = True  # Flag to start timer
                    return redirect('quiz_page')
                else:
                    messages.error(request, "Failed to load questions. Please try again.")
            except Exception as e:
                messages.error(request, f"Error: {str(e)}")
    else:
        form = QuizUserForm()
        
    return render(request, 'quiz_app/index.html', {'form': form})

def quiz_page(request):
    """Quiz page with questions and timer"""
    # Check if user is authenticated
    if 'user_email' not in request.session:
        messages.error(request, "Please enter your email to start the quiz")
        return redirect('index')
        
    # Check if questions are loaded
    if 'quiz_questions' not in request.session:
        messages.error(request, "Quiz questions not loaded. Please start again.")
        return redirect('index')
        
    return render(request, 'quiz_app/quiz_page.html', {
        'email': request.session['user_email'],
    })

def report_page(request):
    """Results page showing questions, answers, and score"""
    # Check if user completed the quiz
    if 'user_email' not in request.session or 'quiz_result' not in request.session:
        messages.error(request, "Please complete the quiz first")
        return redirect('index')
        
    result = request.session['quiz_result']
    
    return render(request, 'quiz_app/report_page.html', {
        'email': request.session['user_email'],
        'result': result
    })

def fetch_questions(request):
    """API endpoint to fetch questions from session"""
    if 'quiz_questions' in request.session:
        return JsonResponse({
            'questions': request.session['quiz_questions'],
            'start_time': request.session.get('start_time', True)
        })
    return HttpResponseBadRequest("No questions available")

@csrf_exempt
def submit_quiz(request):
    """API endpoint to submit quiz answers"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_answers = data.get('answers', {})
            questions = request.session.get('quiz_questions', [])
            
            # Calculate score
            score = 0
            for q_idx, question in enumerate(questions):
                if str(q_idx) in user_answers and user_answers[str(q_idx)] == question['correct_answer']:
                    score += 1
            
            # Save result to database
            if 'user_email' in request.session:
                user = QuizUser.objects.get(email=request.session['user_email'])
                quiz_result = QuizResult.objects.create(
                    user=user,
                    questions=questions,
                    user_answers=user_answers,
                    score=score
                )
                
                # Store result in session for report page
                result = {
                    'questions': questions,
                    'user_answers': user_answers,
                    'score': score,
                    'total': len(questions)
                }
                request.session['quiz_result'] = result
                
                return JsonResponse({'success': True, 'score': score, 'total': len(questions)})
            
            return HttpResponseBadRequest("User not authenticated")
        except Exception as e:
            return HttpResponseBadRequest(f"Error: {str(e)}")
            
    return HttpResponseBadRequest("Invalid request method")