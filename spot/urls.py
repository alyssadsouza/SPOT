from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("calendar/<int:month>/<int:year>", views.calendar, name="calendar"),

    path("projects",views.projects,name="projects"),
    path("project/<int:id>",views.project,name="project"),
    path("event/<int:id>", views.event, name="event"),

    path("add-project", views.add_project, name="add-project"),
    path("delete-project/<int:id>", views.delete_project, name="delete-project"),
    path("edit-project/<int:id>", views.edit_project, name="edit-project"),
    path("delete-task/<int:id>", views.delete_task, name="delete-task"),
    path("edit-task/<int:id>", views.edit_task, name="edit-task"),

    path("login", views.login_view, name="login"),
    path("register", views.register, name="register"),
    path("logout", views.logout_view, name="logout")
]