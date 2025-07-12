from django.contrib import admin
from .models import Story, Chapter

admin.site.register([Story, Chapter])
