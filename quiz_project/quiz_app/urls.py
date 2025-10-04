from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('quiz/', views.quiz_page, name='quiz_page'),
    path('report/', views.report_page, name='report_page'),
    # API endpoints
    path('api/fetch-questions/', views.fetch_questions, name='fetch_questions'),
    path('api/submit-quiz/', views.submit_quiz, name='submit_quiz'),
]