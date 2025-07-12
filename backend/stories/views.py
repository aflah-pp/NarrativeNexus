from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions, response, status
from rest_framework.pagination import PageNumberPagination
from .models import Story, Chapter, Comment, Notification
from .serializers import (
    StorySerializer,
    StoryListSerializer,
    ChapterSerializer,
    CommentSerializer,
    NotificationSerializer,
)

# Helper Pagination Class
class SmallPagination(PageNumberPagination):
    page_size = 10

#--------✅ Helper to check author permission----------
def is_author_or_read_only(request, obj):
    if request.method in permissions.SAFE_METHODS:
        return True
    return obj.author == request.user

#--------📚 LIST + CREATE STORIES ---------
@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticatedOrReadOnly])
def story_list_create(request):
    if request.method == 'GET':
        stories = Story.objects.select_related('author').prefetch_related('tags', 'likes', 'bookmarks')
        serializer = StoryListSerializer(stories, many=True, context={'request': request})
        return response.Response(serializer.data)

    serializer = StorySerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save(author=request.user)
        return response.Response(serializer.data, status=status.HTTP_201_CREATED)
    return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#--------📖 GET, UPDATE, DELETE STORY ---------
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticatedOrReadOnly])
def story_detail(request, pk):
    story = get_object_or_404(Story.objects.select_related('author').prefetch_related('chapters', 'tags', 'likes', 'bookmarks'), pk=pk)

    if request.method == 'GET':
        serializer = StorySerializer(story, context={'request': request})
        return response.Response(serializer.data)

    if not is_author_or_read_only(request, story):
        return response.Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'PUT':
        serializer = StorySerializer(story, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return response.Response(serializer.data)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    story.delete()
    return response.Response(status=status.HTTP_204_NO_CONTENT)

#--------❤️ TOGGLE LIKE ---------
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def toggle_like(request, pk):
    story = get_object_or_404(Story, pk=pk)
    user = request.user

    if user in story.likes.all():
        story.likes.remove(user)
        action = 'disliked'
    else:
        story.likes.add(user)
        action = 'liked'

    return response.Response({'likes_count': story.likes.count(), 'action': action})

#---------🔖 TOGGLE BOOKMARK ---------
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def toggle_bookmark(request, pk):
    story = get_object_or_404(Story, pk=pk)
    user = request.user

    if user in story.bookmarks.all():
        story.bookmarks.remove(user)
        action = 'unmarked'
    else:
        story.bookmarks.add(user)
        action = 'bookmarked'

    return response.Response({'bookmarks_count': story.bookmarks.count(), 'action': action})

#----------💬 COMMENTS (LIST & POST)----------
@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticatedOrReadOnly])
def comment_list_create(request, pk):
    story = get_object_or_404(Story, pk=pk)

    if request.method == 'GET':
        comments = Comment.objects.filter(story=story).order_by('-created_at')
        paginator = SmallPagination()
        result = paginator.paginate_queryset(comments, request)
        serializer = CommentSerializer(result, many=True)
        return paginator.get_paginated_response(serializer.data)

    if request.method == 'POST':
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, story=story)
            return response.Response(serializer.data, status=201)
        return response.Response(serializer.errors, status=400)

#----------📘 CHAPTERS (LIST & CREATE)-------------
@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticatedOrReadOnly])
def chapter_list_create(request, story_id):
    story = get_object_or_404(Story, pk=story_id)

    if request.method == 'GET':
        chapters = Chapter.objects.filter(story=story)
        if request.user != story.author:
            chapters = chapters.filter(is_published=True)
        serializer = ChapterSerializer(chapters, many=True)
        return response.Response(serializer.data)

    if request.user != story.author:
        return response.Response({'error': 'Only the author can add chapters.'}, status=403)

    serializer = ChapterSerializer(data=request.data)
    if not serializer.is_valid():
        return response.Response(serializer.errors, status=400)

    chapter = serializer.save(story=story)
    return response.Response(ChapterSerializer(chapter).data, status=201)

#----------- 📙 CHAPTER DETAIL, UPDATE, DELETE--------------
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticatedOrReadOnly])
def chapter_detail(request, story_id, chapter_no):
    chapter = get_object_or_404(Chapter, story_id=story_id, chapter_no=chapter_no)

    if not chapter.is_published and chapter.story.author != request.user:
        return response.Response({'error': 'Draft chapters are private.'}, status=403)

    if request.method == 'GET':
        serializer = ChapterSerializer(chapter)
        return response.Response(serializer.data)

    if chapter.story.author != request.user:
        return response.Response({'error': 'Permission denied'}, status=403)

    if request.method == 'PUT':
        serializer = ChapterSerializer(chapter, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return response.Response(serializer.data)
        return response.Response(serializer.errors, status=400)

    chapter.delete()
    return response.Response(status=204)

#-------------📩 USER NOTIFICATIONS------------------
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def notification_list(request):
    user = request.user
    if request.method == 'GET':
        notifications = Notification.objects.filter(user=user).order_by('-created_at')
        serializer = NotificationSerializer(notifications, many=True)
        unread_count = notifications.filter(is_read=False).count()
        return response.Response({
            "notifications": serializer.data,
            "unread_count": unread_count
        })

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def toggle_notification_read(request, notify_id):
    user = request.user
    try:
        notify = Notification.objects.get(id=notify_id, user=user)
        if not notify.is_read:
            notify.is_read = True
            notify.save()
        return response.Response({'id': notify.id, 'is_read': notify.is_read})
    except Notification.DoesNotExist:
        return response.Response({'error': 'Notification not found'}, status=404)

#-----------------👤 USER'S STORIES----------------------
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def user_stories_list(request, username):
    stories = Story.objects.filter(author__username=username).select_related('author').prefetch_related('tags', 'likes', 'bookmarks')
    serializer = StoryListSerializer(stories, many=True, context={'request': request})
    return response.Response(serializer.data)

#----------------🔖 USER'S BOOKMARKED STORIES-------------
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def bookmarked_stories(request):
    user = request.user
    bookmarked = user.bookmarked_stories.select_related('author').prefetch_related('tags', 'likes', 'bookmarks')
    serializer = StoryListSerializer(bookmarked, many=True, context={'request': request})
    return response.Response(serializer.data)
