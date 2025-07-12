import json
from channels.generic.websocket import AsyncWebsocketConsumer
from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.conf import settings
from django.contrib.auth import get_user_model
from jwt import decode as jwt_decode, InvalidTokenError

User = get_user_model()


#-----------------Channel Consumer fro Notifications----------------------

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # 🔍 Extract token from query string
        query_string = self.scope["query_string"].decode()
        token = parse_qs(query_string).get("token", [None])[0]

        # 🔐 Authenticate the user
        self.user = await self.get_user_from_token(token)

        if not self.user:
            await self.close()
            return

        # 🔗 Setup group name
        self.group_name = f"user_{self.user.id}"

        # ✅ Join group
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    @database_sync_to_async
    def get_user_from_token(self, token):
        try:
            if not token:
                return None
            decoded = jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = decoded.get("user_id")
            return User.objects.get(id=user_id)
        except (InvalidTokenError, User.DoesNotExist, Exception):
            return None

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        # Optional: you could handle messages from frontend here
        pass

    async def send_notification(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "url": event.get("url", "")
        }))
