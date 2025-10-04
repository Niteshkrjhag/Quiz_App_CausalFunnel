document.addEventListener('DOMContentLoaded', function() {
    const resultsContainer = document.getElementById('results-container');
    const scoreElement = document.getElementById('score');
    const scoreBar = document.getElementById('score-bar');
    
    // Process results from the server side
    function processResults() {
        // Get quiz result data from Django template context
        fetch('/api/fetch-questions/')
            .then(response => response.json())
            .then(data => {
                const questions = data.questions;
                
                // Get user answers from Django template
                const userAnswersJSON = document.getElementById('user-answers-data');
                const userAnswers = userAnswersJSON ? JSON.parse(userAnswersJSON.textContent) : {};
                
                displayResults(questions, userAnswers);
            })
            .catch(error => {
                console.error('Error loading results:', error);
                resultsContainer.innerHTML = '<div class="alert alert-danger">Failed to load quiz results. Please try again.</div>';
            });
    }
    
    // Display the results
    function displayResults(questions, userAnswers) {
        if (!questions || questions.length === 0) {
            resultsContainer.innerHTML = '<div class="alert alert-warning">No questions found</div>';
            return;
        }
        
        // Create a results accordion
        const accordion = document.createElement('div');
        accordion.className = 'accordion';
        accordion.id = 'resultsAccordion';
        
        questions.forEach((question, index) => {
            const userAnswer = userAnswers[index] || 'Not answered';
            const isCorrect = userAnswer === question.correct_answer;
            
            // Create accordion item
            const accordionItem = document.createElement('div');
            accordionItem.className = 'accordion-item';
            
            // Create accordion header
            const header = document.createElement('h2');
            header.className = 'accordion-header';
            
            const button = document.createElement('button');
            button.className = `accordion-button ${isCorrect ? '' : 'text-danger'} ${index === 0 ? '' : 'collapsed'}`;
            button.type = 'button';
            button.dataset.bsToggle = 'collapse';
            button.dataset.bsTarget = `#collapse${index}`;
            button.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
            button.setAttribute('aria-controls', `collapse${index}`);
            
            const statusIcon = isCorrect ? 
                '<span class="badge bg-success me-2"><i class="bi bi-check-lg"></i></span>' : 
                '<span class="badge bg-danger me-2"><i class="bi bi-x-lg"></i></span>';
                
            button.innerHTML = `${statusIcon} Question ${index + 1}`;
            header.appendChild(button);
            
            // Create accordion body
            const collapseDiv = document.createElement('div');
            collapseDiv.id = `collapse${index}`;
            collapseDiv.className = `accordion-collapse collapse ${index === 0 ? 'show' : ''}`;
            collapseDiv.setAttribute('aria-labelledby', `heading${index}`);
            collapseDiv.dataset.bsParent = '#resultsAccordion';
            
            const body = document.createElement('div');
            body.className = 'accordion-body';
            
            body.innerHTML = `
                <p class="fw-bold">${decodeHTMLEntities(question.question)}</p>
                <div class="mb-3">
                    <strong>Your answer:</strong> 
                    <span class="${isCorrect ? 'text-success' : 'text-danger'}">${decodeHTMLEntities(userAnswer)}</span>
                </div>
                <div>
                    <strong>Correct answer:</strong> 
                    <span class="text-success">${decodeHTMLEntities(question.correct_answer)}</span>
                </div>
                <div class="mt-2">
                    <strong>Category:</strong> ${question.category}
                </div>
                <div>
                    <strong>Difficulty:</strong> ${question.difficulty}
                </div>
            `;
            
            collapseDiv.appendChild(body);
            
            // Add header and body to accordion item
            accordionItem.appendChild(header);
            accordionItem.appendChild(collapseDiv);
            
            // Add accordion item to main accordion
            accordion.appendChild(accordionItem);
        });
        
        // Add the accordion to the container
        resultsContainer.innerHTML = '';
        resultsContainer.appendChild(accordion);
    }
    
    // Helper function to decode HTML entities
    function decodeHTMLEntities(text) {
        if (!text) return '';
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }
    
    // Initialize
    if (resultsContainer) {
        processResults();
    }
});