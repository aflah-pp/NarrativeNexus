from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from stories.models import Story, Chapter, Notification
from users.models import CustomUser, Follow
from django.db.models import Subquery
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


#------logic for live notification------

def send_realtime_notification(user_id, message, url=None):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_{user_id}",
        {
            "type": "send_notification",
            "message": message,
            "url": url or ""
        }
    )


#-------1️⃣ Notify followers when a new story is created----

@receiver(post_save, sender=Story)
def notify_followers_on_story_create(sender, instance, created, **kwargs):
    if created:
        author = instance.author
        followers = CustomUser.objects.filter(
            id__in=Subquery(Follow.objects.filter(following=author).values("follower_id"))
        ).exclude(id=author.id)

        notifications = [
            Notification(
                user=follower,
                message=f"{author.username} just dropped a new story: '{instance.title}'",
                url=f"/explore/{instance.id}/"
            )
            for follower in followers
        ]
        Notification.objects.bulk_create(notifications)

        # 🔴 Send live notification
        for follower in followers:
            send_realtime_notification(
                follower.id,
                f"{author.username} just dropped a new story: '{instance.title}'",
                f"/explore/{instance.id}/"
            )


#-------2️⃣ Notify user when they get a new follower-------

@receiver(post_save, sender=Follow)
def notify_on_follow(sender, instance, created, **kwargs):
    if created:
        followed_user = instance.following
        follower = instance.follower
        if followed_user != follower:
            Notification.objects.create(
                user=followed_user,
                message=f"{follower.username} started following you.",
                url=f"/community/{follower.id}/"
            )

            send_realtime_notification(
                followed_user.id,
                f"{follower.username} started following you.",
                f"/community/{follower.id}/"
            )


#----------3️⃣ Notify all bookmarkers when a chapter is published------

_old_publish_status = {}

@receiver(pre_save, sender=Chapter)
def cache_old_publish_status(sender, instance, **kwargs):
    if instance.pk:
        try:
            old_instance = Chapter.objects.get(pk=instance.pk)
            _old_publish_status[instance.pk] = old_instance.is_published
        except Chapter.DoesNotExist:
            _old_publish_status[instance.pk] = False

@receiver(post_save, sender=Chapter)
def notify_bookmarkers_on_publish(sender, instance, created, **kwargs):
    if created:
        return
    old_published = _old_publish_status.pop(instance.pk, False)
    if not old_published and instance.is_published:
        story = instance.story
        bookmarkers = story.bookmarks.exclude(id=story.author_id)
        notifications = [
            Notification(
                user=user,
                message=f"New chapter in '{story.title}': {instance.title or f'Chapter {instance.chapter_no}'}",
                url=f"/explore/{story.id}/"
            )
            for user in bookmarkers
        ]
        Notification.objects.bulk_create(notifications)

        for user in bookmarkers:
            send_realtime_notification(
                user.id,
                f"New chapter in '{story.title}': {instance.title or f'Chapter {instance.chapter_no}'}",
                f"/explore/{story.id}/"
            )
