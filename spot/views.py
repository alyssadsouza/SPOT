from django.http import HttpResponse,HttpResponseRedirect
from django.http.response import JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.urls import reverse
from .models import Event, Project, User


import json

import calendar as cd
import datetime

# Create your views here.

@login_required
def index(request):
    events = Event.objects.all()
    for event in events:
        if event.deadline.timestamp() < datetime.datetime.now().timestamp():
            event.late = True
            event.save()
    return HttpResponseRedirect("calendar/6")
    
@login_required
def calendar(request,month):
    c=cd.Calendar(firstweekday=6)
    calendar = c.monthdatescalendar(2021,month)
    # date = datetime.datetime(2021,6,25,00,00,00)
    # print(date)
    # event = Event(title="PD Day",start_time=date)
    # event.save()    
    events = Event.objects.filter(user=request.user,deadline__month=month)
    todays_events = Event.objects.filter(user=request.user,deadline__date=datetime.datetime.now().date())
    today = datetime.datetime.now().date()

    next_month = month + 1
    months = {1:"January",2:"February",3:"March",4:"April",5:"May",6:"June",7:"July",8:"August",9:"September",10:"October",11:"November",12:"December"}

    return render(request,"calendar.html",{
        "month":calendar,
        "next_month":next_month,
        "prev_month":next_month-2,
        "month_name":months[month],
        "events":events,
        "todays_events":todays_events,
        "today":today
        })

@login_required
def blueprints(request):
    if request.method == 'POST':
        title, deadline, front_end = request.POST["title"], request.POST["deadline"],request.POST["front_end"]
        project = Project.objects.get(pk=int(request.POST["project"]))
        task = Event(user=request.user,project=project, title=title, deadline=deadline,front_end=front_end)
        task.save()

    get_projects = Project.objects.filter(user=request.user).order_by('deadline')
    projects = {}

    for project in get_projects:
        tasks = Event.objects.filter(user=request.user,project=project).order_by('deadline')
        projects[project] = tasks

    # projects = {}

    return render(request, "blueprints.html",{"projects":projects})

@login_required
def add_project(request):
    if request.method == "POST":
        title, description, deadline = request.POST["title"],  request.POST["description"],  request.POST["deadline"]
        print(title,description,deadline)
        project = Project(user=request.user,title=title,description=description,deadline=deadline)
        project.save()
        return HttpResponseRedirect("blueprints")

    return render(request, "add_project.html")    

@login_required
@csrf_exempt
def event(request, id):
    try:
        event = Event.objects.get(pk=id)
    except Event.DoesNotExist:
        return JsonResponse({"error": "Event not found."}, status=404)
    if request.method == 'PUT':
        data = json.loads(request.body)
        print(data, event)
        if data.get("completed") is not None:
            event.completed = data["completed"]
        event.save()
        return HttpResponse(status=204)
    else:
        return(HttpResponse(status=404))

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        print(username,password)
        user = authenticate(username=username, password=password)
        print(user)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register(request):
    if request.method == "POST":
        username = request.POST["username"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username=username, password=password)
            user.save()
        except IntegrityError as e:
            print(e)
            return render(request, "register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "register.html")