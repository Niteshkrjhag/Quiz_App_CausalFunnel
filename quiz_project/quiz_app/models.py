

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