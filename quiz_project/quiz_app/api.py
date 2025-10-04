import requests
import html
import json

def fetch_quiz_questions():
    """
    Fetch 15 questions from the Open Trivia Database API
    """
    url = "https://opentdb.com/api.php?amount=15"
    try:
        response = requests.get(url)
        data = response.json()
        
        if data["response_code"] == 0:
            # Process the questions to decode HTML entities and format data
            questions = []
            for i, q in enumerate(data["results"]):
                question = {
                    "id": i + 1,
                    "question": html.unescape(q["question"]),
                    "correct_answer": html.unescape(q["correct_answer"]),
                    "choices": [html.unescape(q["correct_answer"])] + [html.unescape(choice) for choice in q["incorrect_answers"]]
                }
                # Shuffle the choices
                import random
                random.shuffle(question["choices"])
                questions.append(question)
            return questions
        else:
            return None
    except Exception as e:
        print(f"Error fetching questions: {e}")
        return None