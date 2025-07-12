from django.db import models
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField


#-----------------USER MODEL--------------------------------

class CustomUser(AbstractUser):
    profile_image = CloudinaryField('image', folder='profile/', blank=True, null=True)
    bio = models.CharField(blank=True, null=True, max_length=50)
    following = models.ManyToManyField('self', symmetrical=False, related_name='followers', blank=True)

    def __str__(self):
        return f"{self.username}"
    
#-----------------FOLLOW MODEL--------------------------------

class Follow(models.Model):
    follower = models.ForeignKey(CustomUser, related_name='following_set', on_delete=models.CASCADE)
    following = models.ForeignKey(CustomUser, related_name='followers_set', on_delete=models.CASCADE)
    followed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'following')

    def __str__(self):
        return f"{self.follower} follows {self.following}"