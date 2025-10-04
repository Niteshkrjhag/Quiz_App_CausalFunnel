# from django.db import models

# class QuizUser(models.Model):
#     email = models.EmailField(unique=True)
#     created_at = models.DateTimeField(auto_now_add=True)
    
#     def __str__(self):
#         return self.email

# class QuizSession(models.Model):
#     user = models.ForeignKey(QuizUser, on_delete=models.CASCADE, related_name='sessions')
#     start_time = models.DateTimeField(auto_now_add=True)
#     end_time = models.DateTimeField(null=True, blank=True)
#     completed = models.BooleanField(default=False)
    
#     def __str__(self):
#         return f"{self.user.email} - {self.start_time}"

# class QuizQuestion(models.Model):
#     session = models.ForeignKey(QuizSession, on_delete=models.CASCADE, related_name='questions')
#     question_id = models.IntegerField()  # To track question number
#     question_text = models.TextField()
#     correct_answer = models.CharField(max_length=255)
#     user_answer = models.CharField(max_length=255, null=True, blank=True)
#     visited = models.BooleanField(default=False)
#     attempted = models.BooleanField(default=False)
    
#     def __str__(self):
#         return f"Question {self.question_id} for {self.session.user.email}"

from django.db import models

class QuizUser(models.Model):
    email = models.EmailField(unique=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email
        
class QuizResult(models.Model):
    user = models.ForeignKey(QuizUser, on_delete=models.CASCADE)
    questions = models.JSONField()  # Store all questions
    user_answers = models.JSONField()  # Store user answers
    score = models.IntegerField(default=0)
    completed_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.email} - Score: {self.score}"