from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from users.models import CustomUser, Follow
from rest_framework_simplejwt.tokens import RefreshToken

class UserFlowTests(APITestCase):
    def setUp(self):
        self.user1 = CustomUser.objects.create_user(
            username="alice", email="alice@test.com", password="pass1234"
        )
        self.user2 = CustomUser.objects.create_user(
            username="bob", email="bob@test.com", password="pass5678"
        )

    def get_auth_headers(self, user):
        refresh = RefreshToken.for_user(user)
        return {"HTTP_AUTHORIZATION": f"Bearer {refresh.access_token}"}

    def test_register_user(self):
        url = reverse("register")
        data = {
            "username": "charlie",
            "email": "charlie@test.com",
            "password": "testpass123",
            "password2": "testpass123"
        }
        res = self.client.post(url, data)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", res.data)

    def test_update_profile(self):
        self.client.credentials(**self.get_auth_headers(self.user1))

        update_data = {
            "username": "alice",
            "email": "alice@test.com",
            "first_name": "Alicia",
            "last_name": "test",
            "bio": "test",
            "profile_image": None 
        }

        res = self.client.put(reverse("user-edit"), update_data, format="json")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["first_name"], "Alicia")

    def test_patch_profile(self):
        self.client.credentials(**self.get_auth_headers(self.user1))
        res = self.client.patch(reverse("user-edit"), {
            "first_name": "Patched"
        }, format="json")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["first_name"], "Patched")

    def test_explore_users(self):
        self.client.credentials(**self.get_auth_headers(self.user1))
        res = self.client.get(reverse("public-users"))
        self.assertEqual(res.status_code, 200)
        usernames = [u["username"] for u in res.data]
        self.assertIn("bob", usernames)
        self.assertNotIn("alice", usernames)

    def test_follow_user(self):
        self.client.credentials(**self.get_auth_headers(self.user1))
        res = self.client.post(reverse("follow-user", args=["bob"]))
        self.assertEqual(res.status_code, 201)
        self.assertTrue(Follow.objects.filter(follower=self.user1, following=self.user2).exists())

    def test_unfollow_user(self):
        Follow.objects.create(follower=self.user1, following=self.user2)
        self.client.credentials(**self.get_auth_headers(self.user1))
        res = self.client.post(reverse("unfollow-user", args=["bob"]))
        self.assertEqual(res.status_code, 200)
        self.assertFalse(Follow.objects.filter(follower=self.user1, following=self.user2).exists())

    def test_prevent_follow_self(self):
        self.client.credentials(**self.get_auth_headers(self.user1))
        res = self.client.post(reverse("follow-user", args=["alice"]))
        self.assertEqual(res.status_code, 400)

    def test_followers_list(self):
        Follow.objects.create(follower=self.user2, following=self.user1)
        self.client.credentials(**self.get_auth_headers(self.user1))
        res = self.client.get(reverse("followers-list", args=["alice"]))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data[0]["username"], "bob")

    def test_following_list(self):
        Follow.objects.create(follower=self.user1, following=self.user2)
        self.client.credentials(**self.get_auth_headers(self.user1))
        res = self.client.get(reverse("following-list", args=["alice"]))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data[0]["username"], "bob")
