from django.urls import path
from .views import (
    PublicUserDetailView, UserRegisterView, UserUpdateView,
    PublicUserListView, FollowUserView,UnfollowUserView, FollowersListView, FollowingListView
)

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='register'),
    path('me/', UserUpdateView.as_view(), name='user-edit'),
    path('explore/', PublicUserListView.as_view(), name='public-users'),
    path('explore/<str:id>/', PublicUserDetailView.as_view(), name='public-user-detail'),

    # 👇 New Follow routes
    path('follow/<str:username>/', FollowUserView.as_view(), name='follow-user'),
    path('unfollow/<str:username>/', UnfollowUserView.as_view(), name='unfollow-user'),

    path('followers/<str:username>/', FollowersListView.as_view(), name='followers-list'),
    path('following/<str:username>/', FollowingListView.as_view(), name='following-list'),
]
