from django.db import models
from django.conf import settings
from cloudinary.models import CloudinaryField


#-----------------CHOICES--------------------------------

class GenreChoices(models.TextChoices):
    FANTASY = "Fantasy"
    SCIFI = "Sci‑Fi"
    MYSTERY = "Mystery"
    ROMANCE = "Romance"
    HORROR = "Horror"
    OTHER = "Other"

class StatusChoices(models.TextChoices):
    ONGOING = "Ongoing"
    COMPLETED = "Completed"
    HIATUS = "Hiatus"
    DRAFT = "Draft"


#-----------------TAG MODEL--------------------------------

class Tag(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name


#-----------------STORY MODEL--------------------------------

class Story(models.Model):
    title = models.CharField(max_length=100, unique=True)
    genre = models.CharField(max_length=50, choices=GenreChoices.choices)
    synopsis = models.CharField(max_length=300)
    cover_image = CloudinaryField('image', folder='cover/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=StatusChoices.choices)
    is_serialized = models.BooleanField(default=False)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='stories')

    #additional fields
    tags = models.ManyToManyField(Tag, related_name='stories', blank=True)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_stories', blank=True)
    bookmarks = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='bookmarked_stories', blank=True)

    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


#-----------------COMMENT MODEL--------------------------------

class Comment(models.Model):
    story = models.ForeignKey('Story', on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Comment on {self.story} by {self.user}"
    

#-----------------CHAPTER MODEL--------------------------------

class Chapter(models.Model):
    story = models.ForeignKey('Story', on_delete=models.CASCADE, related_name='chapters')
    chapter_no = models.PositiveIntegerField()
    title = models.CharField(max_length=100)
    content = models.TextField(blank=False, null=False)
    order = models.PositiveIntegerField(default=1)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']
        unique_together = ('story', 'chapter_no')

    def __str__(self):
        return f"{self.story.title} - Chapter {self.chapter_no}: {self.title}"


#-----------------NOTIFICATION MODEL--------------------------------

class Notification(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    message = models.TextField()
    url = models.URLField(null=True, blank=True)  
    is_read = models.BooleanField(default=False)
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.message[:30]}"