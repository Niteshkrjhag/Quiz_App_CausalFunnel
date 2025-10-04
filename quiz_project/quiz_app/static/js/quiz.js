document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    let questions = [];
    let currentQuestionIndex = 0;
    let userAnswers = {};
    let visitedQuestions = new Set();
    let timerInterval;
    let secondsRemaining = 30 * 60; // 30 minutes
    
    // DOM elements
    const questionTitle = document.getElementById('question-title');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitQuizBtn = document.getElementById('submit-quiz-btn');
    const questionOverview = document.getElementById('question-overview');
    const timerElement = document.getElementById('timer');
    
    // Fetch questions from the server
    function fetchQuestions() {
        fetch('/api/fetch-questions/')
            .then(response => response.json())
            .then(data => {
                questions = data.questions;
                
                // Initialize question overview
                createQuestionOverview();
                
                // Load the first question
                loadQuestion(0);
                
                // Start the timer
                if (data.start_time) {
                    startTimer();
                }
            })
            .catch(error => {
                console.error('Error fetching questions:', error);
                questionText.innerHTML = 'Failed to load questions. Please refresh the page.';
            });
    }
    
    // Create the question overview panel
    function createQuestionOverview() {
        questionOverview.innerHTML = '';
        
        for (let i = 0; i < questions.length; i++) {
            const questionIndicator = document.createElement('div');
            questionIndicator.className = 'question-number badge bg-secondary';
            questionIndicator.textContent = i + 1;
            questionIndicator.dataset.index = i;
            
            questionIndicator.addEventListener('click', () => {
                loadQuestion(parseInt(questionIndicator.dataset.index));
            });
            
            questionOverview.appendChild(questionIndicator);
        }
    }
    
    // Update the question overview indicators
    function updateQuestionOverview() {
        const indicators = questionOverview.querySelectorAll('.question-number');
        
        indicators.forEach((indicator, index) => {
            // Reset class
            indicator.className = 'question-number badge';
            
            if (userAnswers.hasOwnProperty(index)) {
                // Answered
                indicator.classList.add('bg-success');
            } else if (visitedQuestions.has(index)) {
                // Visited but not answered
                indicator.classList.add('bg-primary');
            } else {
                // Not visited
                indicator.classList.add('bg-secondary');
            }
            
            // Highlight current question
            if (index === currentQuestionIndex) {
                indicator.style.border = '2px solid #000';
            } else {
                indicator.style.border = 'none';
            }
        });
    }
    
    // Load a specific question
    function loadQuestion(index) {
        if (index < 0 || index >= questions.length) return;
        
        currentQuestionIndex = index;
        const question = questions[currentQuestionIndex];
        
        // Mark as visited
        visitedQuestions.add(currentQuestionIndex);
        
        // Update title and question text
        questionTitle.textContent = `Question ${currentQuestionIndex + 1}`;
        questionText.innerHTML = decodeHTMLEntities(question.question);
        
        // Create options
        createOptions(question);
        
        // Update buttons
        prevBtn.disabled = currentQuestionIndex === 0;
        
        // Show submit button on the last question
        if (currentQuestionIndex === questions.length - 1) {
            nextBtn.classList.add('d-none');
            submitQuizBtn.classList.remove('d-none');
        } else {
            nextBtn.classList.remove('d-none');
            submitQuizBtn.classList.add('d-none');
        }
        
        // Update overview panel
        updateQuestionOverview();
    }
    
    // Create the answer options for a question
    function createOptions(question) {
        optionsContainer.innerHTML = '';
        
        // Get all possible answers and shuffle them
        const allAnswers = [
            question.correct_answer,
            ...question.incorrect_answers
        ].sort(() => Math.random() - 0.5);
        
        // Create each option
        allAnswers.forEach((answer, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option-item';
            optionDiv.innerHTML = decodeHTMLEntities(answer);
            optionDiv.dataset.answer = answer;
            
            // Check if this option is the selected answer
            if (userAnswers[currentQuestionIndex] === answer) {
                optionDiv.classList.add('selected');
            }
            
            // Add click event
            optionDiv.addEventListener('click', () => selectOption(optionDiv, answer));
            
            optionsContainer.appendChild(optionDiv);
        });
    }
    
    // Handle option selection
    function selectOption(optionElement, answer) {
        // Remove selected class from all options
        const options = optionsContainer.querySelectorAll('.option-item');
        options.forEach(opt => opt.classList.remove('selected'));
        
        // Add selected class to clicked option
        optionElement.classList.add('selected');
        
        // Save the answer
        userAnswers[currentQuestionIndex] = answer;
        
        // Update overview panel
        updateQuestionOverview();
    }
    
    // Navigation event handlers
    prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            loadQuestion(currentQuestionIndex - 1);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            loadQuestion(currentQuestionIndex + 1);
        }
    });
    
    // Submit quiz
    submitQuizBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to submit the quiz?')) {
            clearInterval(timerInterval);
            submitQuiz();
        }
    });
    
    // Handle quiz submission
    function submitQuiz() {
        fetch('/api/submit-quiz/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                answers: userAnswers
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/report/';
            }
        })
        .catch(error => {
            console.error('Error submitting quiz:', error);
            alert('Failed to submit quiz. Please try again.');
        });
    }
    
    // Timer functions
    function startTimer() {
        updateTimerDisplay();
        
        timerInterval = setInterval(() => {
            secondsRemaining--;
            
            if (secondsRemaining <= 0) {
                clearInterval(timerInterval);
                alert('Time is up! Submitting your quiz now.');
                submitQuiz();
            } else {
                updateTimerDisplay();
            }
        }, 1000);
    }
    
    function updateTimerDisplay() {
        const minutes = Math.floor(secondsRemaining / 60);
        const seconds = secondsRemaining % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Add warning color when less than 5 minutes remain
        if (secondsRemaining < 300) {
            timerElement.parentElement.classList.remove('alert-info');
            timerElement.parentElement.classList.add('alert-danger');
        }
    }
    
    // Helper function to decode HTML entities
    function decodeHTMLEntities(text) {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }
    
    // Initialize the quiz
    fetchQuestions();
});