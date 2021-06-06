from django.db import models
from django.contrib.auth.models import AbstractUser
import datetime

from django.db.models.deletion import CASCADE

# Create your models here.

class User(AbstractUser):
    pass


class Project(models.Model):
    user = models.ForeignKey(User, on_delete=CASCADE, related_name="projects",blank=True,null=True)
    title = models.CharField(max_length=64)
    description = models.TextField(default="No description yet.")
    deadline = models.DateTimeField()

    def __str__(self):
        return self.title

class Event(models.Model):
    user = models.ForeignKey(User, on_delete=CASCADE, related_name="userstasks",blank=True,null=True)
    project = models.ForeignKey(Project, on_delete=CASCADE, related_name="tasks", default="")
    title = models.CharField(max_length=64)
    deadline = models.DateTimeField()
    front_end = models.BooleanField(default=True)
    completed = models.BooleanField(default=False)
    late = models.BooleanField(default=False)

    def __str__(self):
        return f"Task for {self.project}: {self.title}"