from django.contrib import admin

from .models import Event, Project, User

# Register your models here.

admin.site.register(Event)
admin.site.register(Project)
admin.site.register(User)