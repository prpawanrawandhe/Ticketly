from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('token/',TokenObtainPairView.as_view()),
    path('refresh/',TokenRefreshView.as_view()),
    path('register/',views.register_view,name="register_view"),
    path('operator-register/',views.operator_register_view,name="operator_register_view"),
]
