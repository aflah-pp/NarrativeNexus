from django.urls import path
from . import views

urlpatterns = [

    # Stories
    path('stories/', views.story_list_create, name='story-list-create'),
    path('stories/<int:pk>/', views.story_detail, name='story-detail'),
    path('stories/<int:pk>/like/', views.toggle_like, name='story-like'),
    path('stories/<int:pk>/bookmark/', views.toggle_bookmark, name='story-bookmark'),
    path('stories/<int:pk>/comments/', views.comment_list_create, name='story-comments'),

    #Notifications
    path('notifications/', views.notification_list, name='notification-list'),
    path('notifications/<int:notify_id>/read/', views.toggle_notification_read, name='notification-toggle-read'),
    
    # User stories
    path('<str:username>/stories/', views.user_stories_list, name='user-stories'),

    #Bookmarked Stories of User
    path('stories/bookmarked/', views.bookmarked_stories, name='bookmarked-stories'),

    #Chapter
    path('stories/<int:story_id>/chapters/', views.chapter_list_create, name='chapter-list-create'),
    path('stories/<int:story_id>/chapters/<int:chapter_no>/', views.chapter_detail, name='chapter-detail'),
]
