# Quiz Application - CausalFunnel Assignment

A Django-based quiz application that fetches questions from the Open Trivia Database API and provides an interactive quiz-taking experience with real-time timer, question navigation, and detailed result reporting.

## Deployed Application

You can try the live application here:  
[![Open Quiz App](https://img.shields.io/badge/Open-Quiz%20App-00aced?style=for-the-badge&logo=python&logoColor=white)](https://nitesh7673.pythonanywhere.com/)

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Application Architecture](#application-architecture)
- [Components](#components)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Assumptions](#assumptions)
- [Challenges and Solutions](#challenges-and-solutions)

## Overview

This quiz application is built using Django framework for the backend and vanilla JavaScript for the frontend interactivity. The application fetches 15 random trivia questions from the [Open Trivia Database API](https://opentdb.com/) and provides users with a 30-minute timed quiz experience.

### My Approach

The application follows a simple yet effective architecture:
1. **Session-Based Management**: User data and quiz state are managed through Django sessions, eliminating the need for complex authentication while ensuring data persistence during the quiz
2. **API-Driven Question Fetching**: Questions are fetched from the Open Trivia Database API at quiz start, providing fresh content for each attempt
3. **Client-Side Interactivity**: JavaScript handles the quiz interface, timer, and question navigation for a smooth user experience
4. **Database Persistence**: User results are stored in SQLite database for record-keeping and potential future analytics

## Features

- ✉️ **Email-Based User Identification**: Simple email input to start the quiz
- ⏱️ **30-Minute Timer**: Automatic countdown timer with auto-submit on timeout
- 🔄 **Question Navigation**: Navigate between questions with Previous/Next buttons
- 📊 **Question Overview Panel**: Visual indicators showing answered, visited, and unattempted questions
- 💾 **Answer Persistence**: Answers are preserved when navigating between questions
- 📈 **Detailed Results**: Comprehensive report showing all questions, user answers, correct answers, and score
- 🎨 **Responsive Design**: Bootstrap-based UI that works on various screen sizes
- 🔍 **Question Tracking**: Real-time tracking of visited and answered questions

## Application Architecture

### Technology Stack
- **Backend**: Django 5.2.7
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Database**: SQLite
- **CSS Framework**: Bootstrap 5
- **External API**: Open Trivia Database API

### Application Flow
```
User Email Input → Fetch Questions from API → Quiz Page (30 min timer) → Submit Answers → Results Page
```

## Components

### Backend Components

#### 1. **Models** (`quiz_app/models.py`)
- **QuizUser**: Stores user email and creation timestamp
  - Fields: `email`, `created_at`
- **QuizResult**: Stores quiz attempt data
  - Fields: `user`, `questions` (JSON), `user_answers` (JSON), `score`, `completed_at`

#### 2. **Views** (`quiz_app/views.py`)
- **index()**: Landing page with email form, fetches questions from API
- **quiz_page()**: Renders quiz interface with timer and questions
- **report_page()**: Displays quiz results with correct/incorrect answers
- **fetch_questions()**: API endpoint to retrieve questions from session
- **submit_quiz()**: API endpoint to process and save quiz submission

#### 3. **Forms** (`quiz_app/forms.py`)
- **QuizUserForm**: Django form for email validation and input

#### 4. **URL Configuration** (`quiz_app/urls.py`)
URL patterns for all views and API endpoints

### Frontend Components

#### 1. **Templates**
- **base.html**: Base template with Bootstrap and common elements
- **index.html**: Landing page with email input form
- **quiz_page.html**: Quiz interface with timer and question display
- **report_page.html**: Results display with score and answer review

#### 2. **JavaScript Modules**
- **quiz.js**: 
  - Question fetching and display
  - Answer selection and storage
  - Question navigation (previous/next/direct)
  - Timer management (countdown and auto-submit)
  - Question overview panel updates
- **report.js**: 
  - Results display
  - Answer comparison (user vs correct)
  - Score visualization

#### 3. **CSS Stylesheets**
- **main.css**: Global styles
- **quiz.css**: Quiz page specific styles
- **style.css**: Additional styling
- **responsive.css**: Mobile responsiveness

### Key Features Implementation

#### Session Management
- User email stored in `request.session['user_email']`
- Questions stored in `request.session['quiz_questions']`
- Results stored in `request.session['quiz_result']`

#### Timer Implementation
- 30-minute countdown (1800 seconds)
- Real-time display update every second
- Auto-submit when timer reaches zero
- Visual formatting (MM:SS)

#### Question Navigation
- Linear navigation with Previous/Next buttons
- Direct navigation by clicking question numbers
- Smart button visibility (hide Next on last question)
- Answer preservation across navigation

#### Question Status Tracking
- **Not Visited**: Gray badge
- **Visited**: Blue badge
- **Answered**: Green badge
- Current question highlighted with border

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Virtual environment (recommended)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Niteshkrjhag/Quiz_App_CausalFunnel.git
   cd Quiz_App_CausalFunnel
   ```

2. **Create and activate virtual environment** (recommended)
   ```bash
   # On Windows
   python -m venv venv
   venv\Scripts\activate

   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```
   
   Note: The requirements.txt contains many packages from development. The essential packages for this project are:
   - Django==5.2.7
   - requests==2.26.0

4. **Navigate to project directory**
   ```bash
   cd quiz_project
   ```

5. **Run database migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser** (optional, for admin access)
   ```bash
   python manage.py createsuperuser
   ```

7. **Run the development server**
   ```bash
   python manage.py runserver
   ```

8. **Access the application**
   - Open your browser and navigate to: `http://localhost:8000`
   - Admin panel (if superuser created): `http://localhost:8000/admin`

### Quick Start
```bash
# After cloning the repository
cd Quiz_App_CausalFunnel
pip install Django requests
cd quiz_project
python manage.py migrate
python manage.py runserver
```

## Usage

1. **Start Quiz**
   - Enter your email address on the landing page
   - Click "Start Quiz" button
   - Questions will be fetched automatically from the API

2. **Taking the Quiz**
   - Read each question carefully
   - Select your answer by clicking on an option
   - Use "Previous" and "Next" buttons to navigate
   - Click on question numbers in the overview panel for direct navigation
   - Monitor the timer in the top section
   - Click "Submit Quiz" on the last question or wait for auto-submit

3. **View Results**
   - After submission, you'll be redirected to the results page
   - View your score and percentage
   - Expand each question to see:
     - The question text
     - Your answer
     - The correct answer
     - Whether you answered correctly or incorrectly

4. **Take Another Quiz**
   - Click "Take Another Quiz" button on results page
   - Enter email again to start a new quiz session

## Assumptions

1. **Internet Connectivity**: The application assumes stable internet connection to fetch questions from the Open Trivia Database API

2. **Browser Compatibility**: Modern browsers with JavaScript enabled are assumed (Chrome, Firefox, Safari, Edge)

3. **Email Uniqueness**: While the email field is not enforced as unique in the database, it's used for user identification. The same email can take multiple quizzes

4. **Question Format**: The application assumes questions from the API will be in the expected format (multiple choice or true/false)

5. **Session Storage**: Browser sessions are assumed to persist during the quiz. Closing the browser or clearing cookies will lose quiz progress

6. **Time Limit**: All quizzes have a fixed 30-minute time limit regardless of difficulty or number of questions

7. **Number of Questions**: The application fetches exactly 15 questions from the API. This is hardcoded in the views

8. **Single Attempt**: Each quiz session is a single attempt. Users cannot pause and resume later

9. **No Authentication**: The application uses email for identification only, without password-based authentication

10. **API Availability**: The Open Trivia Database API is assumed to be available and returning valid responses

## Challenges and Solutions

### Challenge 1: HTML Entity Encoding in Questions
**Problem**: Questions and answers from the Open Trivia DB API contained HTML entities (e.g., `&quot;`, `&#039;`, `&amp;`) that were displayed as-is, making questions hard to read.

**Solution**: Implemented a `decodeHTMLEntities()` helper function in JavaScript that uses a temporary textarea element to decode HTML entities before displaying questions and answers:
```javascript
function decodeHTMLEntities(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
}
```

### Challenge 2: Session-Based State Management
**Problem**: Needed to maintain quiz state (questions, answers, user info) across multiple pages without complex authentication.

**Solution**: Leveraged Django's built-in session framework to store:
- User email
- Fetched questions
- User answers
- Quiz results

This approach simplified implementation while maintaining data persistence throughout the quiz flow.

### Challenge 3: Timer Auto-Submit
**Problem**: When the timer reached zero, the quiz needed to automatically submit without user intervention.

**Solution**: Implemented a JavaScript interval that:
1. Decrements the timer every second
2. Updates the display
3. When reaching zero, automatically triggers the submit function
4. Clears the interval to prevent memory leaks

### Challenge 4: Question Navigation State
**Problem**: Tracking which questions were visited, answered, or unanswered while allowing free navigation between questions.

**Solution**: Used JavaScript data structures:
- `Set` for tracking visited questions (efficient lookup)
- Object for storing user answers (key-value pairs)
- Dynamic CSS classes for visual indicators
- Real-time updates on every navigation action

### Challenge 5: Answer Persistence During Navigation
**Problem**: User answers needed to be preserved when navigating between questions and pre-selected when returning to a question.

**Solution**: 
1. Store answers in a JavaScript object with question index as key
2. When loading a question, check if an answer exists
3. If exists, pre-select the corresponding radio button
4. Update answer object when user selects different option

### Challenge 6: Mixed Question Types from API
**Problem**: The API returns both multiple choice and true/false questions with different option formats (`incorrect_answers` array + `correct_answer`).

**Solution**: Normalized the question format on the client side:
1. Combined `incorrect_answers` and `correct_answer` into a single options array
2. Shuffled options to prevent correct answer always appearing in the same position
3. Rendered all questions uniformly as radio button lists

### Challenge 7: Score Calculation Accuracy
**Problem**: Needed to accurately calculate scores by comparing user answers with correct answers across different question formats.

**Solution**: 
- Stored complete question data (including correct answers) in session
- Compared user answers with correct answers using exact string matching
- Used question index as the key for reliable mapping between questions and answers

### Challenge 8: Results Display Organization
**Problem**: Displaying 15 questions with their options, user answers, and correct answers in a readable format.

**Solution**: Implemented an accordion-style interface using Bootstrap:
- Each question is an accordion item
- Collapsed by default (except first question)
- Color-coded headers (green for correct, red for incorrect)
- Shows question text, all options, user answer, and correct answer
- Users can expand/collapse to review specific questions

### Challenge 9: API Error Handling
**Problem**: External API calls could fail due to network issues or API downtime.

**Solution**: Implemented try-catch blocks with user-friendly error messages:
- Catch exceptions during API calls
- Display error messages using Django's message framework
- Allow users to retry by redirecting back to the start page
- Graceful degradation without application crashes

### Challenge 10: Database Model Design
**Problem**: Needed to store complex quiz data (questions, answers) efficiently without creating multiple related tables.

**Solution**: Used Django's JSONField to store:
- Complete question data with all options
- User answers as a dictionary
- This simplified the schema while maintaining data integrity
- Made it easy to display results without additional queries

## Future Enhancements

Potential improvements for future versions:
- User authentication system
- Quiz difficulty selection
- Category-based questions
- Leaderboard functionality
- Quiz history and analytics
- Pause and resume functionality
- Mobile app version
- Social sharing of results
- Timed questions (individual question timer)
- Quiz customization (number of questions, time limit)

## Contributing

This project is part of a technical assessment. For suggestions or improvements, please open an issue or submit a pull request.

## License

This project is created for educational purposes as part of the CausalFunnel technical assessment.

## Contact

For questions or feedback regarding this project, please contact through the repository.

---

**Note**: This application was developed as a technical assessment for CausalFunnel, demonstrating proficiency in Django, JavaScript, API integration, and full-stack web development.
