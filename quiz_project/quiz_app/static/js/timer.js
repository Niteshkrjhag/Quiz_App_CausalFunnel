document.addEventListener('DOMContentLoaded', function() {
    // Get timer element
    const timerElement = document.getElementById('timer');
    
    // Get remaining seconds from data attribute
    const sessionDataElement = document.getElementById('session-data');
    let remainingSeconds = parseInt(sessionDataElement.getAttribute('data-remaining-seconds')) || 1800; // Default to 30 minutes
    
    // Update timer every second
    const timerInterval = setInterval(function() {
        remainingSeconds--;
        
        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            alert('Time is up! Submitting your quiz.');
            window.location.href = '/end-quiz/';
            return;
        }
        
        // Format time as MM:SS
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        // Add warning class when less than 5 minutes remaining
        if (remainingSeconds <= 300) {
            timerElement.classList.add('timer-warning', 'bg-red-100', 'text-red-700');
        }
    }, 1000);
    
    // Format initial time display
    const initialMinutes = Math.floor(remainingSeconds / 60);
    const initialSeconds = remainingSeconds % 60;
    timerElement.textContent = `${String(initialMinutes).padStart(2, '0')}:${String(initialSeconds).padStart(2, '0')}`;
});