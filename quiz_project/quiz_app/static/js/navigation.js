document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to question buttons for hover effects
    const questionButtons = document.querySelectorAll('.question-btn');
    
    questionButtons.forEach(btn => {
        btn.addEventListener('mouseover', function() {
            const questionId = this.getAttribute('data-question-id');
            const questionStatus = getQuestionStatus(this);
            
            // Create tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'absolute bg-gray-800 text-white text-xs rounded py-1 px-2 -mt-8 z-10';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
            
            let statusText = 'Not visited';
            
            if (questionStatus === 'attempted') {
                statusText = 'Attempted';
            } else if (questionStatus === 'visited') {
                statusText = 'Visited';
            }
            
            tooltip.textContent = `Question ${questionId}: ${statusText}`;
            
            this.style.position = 'relative';
            this.appendChild(tooltip);
        });
        
        btn.addEventListener('mouseout', function() {
            const tooltip = this.querySelector('div');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
    
    // Helper function to get question status
    function getQuestionStatus(buttonElement) {
        if (buttonElement.classList.contains('bg-green-500')) {
            return 'attempted';
        } else if (buttonElement.classList.contains('bg-blue-200')) {
            return 'visited';
        }
        return 'not-visited';
    }
});