from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from users.models import CustomUser
from .models import Story, Chapter, Comment, Notification, Tag
from rest_framework_simplejwt.tokens import RefreshToken


def get_auth_headers(user):
    refresh = RefreshToken.for_user(user)
    return {"HTTP_AUTHORIZATION": f"Bearer {refresh.access_token}"}


class StoryFlowTests(APITestCase):
    def setUp(self):
        self.author = CustomUser.objects.create_user(username="author", password="pass123")
        self.reader = CustomUser.objects.create_user(username="reader", password="pass456")

        self.story = Story.objects.create(
            title="Test Story",
            synopsis="A short test story.",
            genre="Fantasy",
            status="Draft",
            is_serialized=False,
            author=self.author,
        )

        self.chapter = Chapter.objects.create(
            story=self.story,
            title="Chapter 1",
            chapter_no=1,
            content="Once upon a time...",
            is_published=True
        )

    def test_story_list(self):
        res = self.client.get(reverse("story-list-create"))
        self.assertEqual(res.status_code, 200)
        self.assertTrue(len(res.data) >= 1)

    def test_create_story_authenticated(self):
        self.client.credentials(**get_auth_headers(self.author))
        res = self.client.post(reverse("story-list-create"), {
            "title": "New Story",
            "synopsis": "Fresh tale",
            "genre": "Mystery",
            "status": "Draft",
            "is_serialized": False,
            "tags": []  
        }, format="json")
        if res.status_code != 201:
            print("🔴 Create Story Error Response:", res.data)
        self.assertEqual(res.status_code, 201)

    def test_create_story_unauthenticated(self):
        res = self.client.post(reverse("story-list-create"), {
            "title": "Ghost Story",
            "synopsis": "Spooky",
            "genre": "Horror",
            "status": "Draft",
            "is_serialized": False,
            "tags": []
        }, format="json")
        self.assertEqual(res.status_code, 401)

    def test_story_detail_view(self):
        res = self.client.get(reverse("story-detail", args=[self.story.id]))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["title"], self.story.title)

    def test_story_update_by_author(self):
        self.client.credentials(**get_auth_headers(self.author))
        res = self.client.put(reverse("story-detail", args=[self.story.id]), {
            "title": "Updated Title",
            "synopsis": self.story.synopsis,
            "genre": self.story.genre,
            "status": self.story.status,
            "is_serialized": self.story.is_serialized,
            "tags": []
        }, format="json")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["title"], "Updated Title")

    def test_story_update_by_other_user(self):
        self.client.credentials(**get_auth_headers(self.reader))
        res = self.client.put(reverse("story-detail", args=[self.story.id]), {
            "title": "Hack Attempt",
            "synopsis": self.story.synopsis,
            "genre": self.story.genre,
            "status": self.story.status,
            "is_serialized": self.story.is_serialized,
            "tags": []
        }, format="json")
        self.assertEqual(res.status_code, 403)

    def test_like_toggle(self):
        self.client.credentials(**get_auth_headers(self.reader))
        res = self.client.post(reverse("story-like", args=[self.story.id]))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["action"], "liked")

        res = self.client.post(reverse("story-like", args=[self.story.id]))
        self.assertEqual(res.data["action"], "disliked")

    def test_bookmark_toggle(self):
        self.client.credentials(**get_auth_headers(self.reader))
        res = self.client.post(reverse("story-bookmark", args=[self.story.id]))
        self.assertEqual(res.data["action"], "bookmarked")

        res = self.client.post(reverse("story-bookmark", args=[self.story.id]))
        self.assertEqual(res.data["action"], "unmarked")

    def test_comment_on_story(self):
        self.client.credentials(**get_auth_headers(self.reader))
        url = reverse("story-comments", args=[self.story.id])
        res = self.client.post(url, {"content": "Nice story!"}, format="json")
        if res.status_code != 201:
            print("🔴 Comment Error Response:", res.data)
        self.assertEqual(res.status_code, 201)
        self.assertEqual(Comment.objects.count(), 1)

    def test_get_chapters_public_user(self):
        self.client.credentials(**get_auth_headers(self.reader))
        url = reverse("chapter-list-create", args=[self.story.id])
        res = self.client.get(url)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data), 1)

    def test_create_chapter_by_author(self):
        self.client.credentials(**get_auth_headers(self.author))
        url = reverse("chapter-list-create", args=[self.story.id])
        res = self.client.post(url, {
            "title": "New Chapter",
            "chapter_no": 2,
            "content": "Another part",
            "is_published": True,
            "story": self.story.id  
        }, format="json")
        if res.status_code != 201:
            print("🔴 Create Chapter Error Response:", res.data)
        self.assertEqual(res.status_code, 201)
        self.assertEqual(Chapter.objects.count(), 2)


    def test_create_chapter_by_other_user_denied(self):
        self.client.credentials(**get_auth_headers(self.reader))
        url = reverse("chapter-list-create", args=[self.story.id])
        res = self.client.post(url, {
            "title": "Illegal",
            "chapter_no": 3,
            "content": "Should fail"
        }, format="json")
        self.assertEqual(res.status_code, 403)

    def test_get_chapter_detail(self):
        res = self.client.get(reverse("chapter-detail", args=[self.story.id, 1]))
        self.assertEqual(res.status_code, 200)

    def test_update_chapter_by_author(self):
        self.client.credentials(**get_auth_headers(self.author))
        url = reverse("chapter-detail", args=[self.story.id, 1])
        res = self.client.put(url, {
            "title": "Updated Chapter",
            "chapter_no": 1,
            "content": "Once upon a time...",
            "is_published": True
        }, format="json")
        if res.status_code != 200:
            print("🔴 Update Chapter Error Response:", res.data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["title"], "Updated Chapter")

    def test_delete_chapter_by_author(self):
        self.client.credentials(**get_auth_headers(self.author))
        url = reverse("chapter-detail", args=[self.story.id, 1])
        res = self.client.delete(url)
        self.assertEqual(res.status_code, 204)
        self.assertEqual(Chapter.objects.count(), 0)

    def test_user_bookmarked_stories(self):
        self.story.bookmarks.add(self.reader)
        self.client.credentials(**get_auth_headers(self.reader))
        res = self.client.get(reverse("bookmarked-stories"))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data), 1)

    def test_notification_flow(self):
        Notification.objects.create(user=self.reader, message="Test", url="/test/")
        self.client.credentials(**get_auth_headers(self.reader))
        res = self.client.get(reverse("notification-list"))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["unread_count"], 1)

        notify_id = Notification.objects.first().id
        res = self.client.post(reverse("notification-toggle-read", args=[notify_id]))
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.data["is_read"])

    def test_user_stories_by_username(self):
        res = self.client.get(reverse("user-stories", args=["author"]))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data), 1)