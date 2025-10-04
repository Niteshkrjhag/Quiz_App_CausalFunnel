from django.contrib import admin

from django.contrib import admin
from .models import QuizUser, QuizResult

admin.site.register(QuizUser)
admin.site.register(QuizResult)
