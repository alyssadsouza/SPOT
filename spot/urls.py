from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("calendar/<int:month>", views.calendar, name="calendar"),
    path("blueprints", views.blueprints, name="blueprints"),
    path("add-project", views.add_project, name="add-project"),
    path("event/<int:id>", views.event, name="event"),
    path("login", views.login_view, name="login"),
    path("register", views.register, name="register"),
    path("logout", views.logout_view, name="logout")
]