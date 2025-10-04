from django import forms
from .models import QuizUser

class QuizUserForm(forms.ModelForm):
    class Meta:
        model = QuizUser
        fields = ['email']
        widgets = {
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Enter your email address'})
        }