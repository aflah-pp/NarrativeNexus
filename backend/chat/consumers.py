# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatRoom, Message
from django.contrib.auth.models import AnonymousUser


class ChatConsumer(AsyncWebsocketConsumer):
    connected_users = set()

    async def connect(self):
        self.room_name = "global"
        self.room_group_name = "chat_global"
        self.user = self.scope["user"]

        if isinstance(self.user, AnonymousUser):
            await self.close()
            return

        self.connected_users.add(self.user.username)

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        await self.send_online_user_count()

    async def disconnect(self, close_code):
        if not isinstance(self.user, AnonymousUser):
            self.connected_users.discard(self.user.username)
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
            await self.send_online_user_count()

    async def receive(self, text_data):
        data = json.loads(text_data)

        message = data.get("message")
        typing = data.get("typing")

        if message:
            await self.save_message(self.user, self.room_name, message)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": message,
                    "user": self.user.username,
                    "online_users": list(self.connected_users),
                    "online_count": len(self.connected_users),
                },
            )

        if typing is not None:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "user_typing",
                    "user": self.user.username,
                    "typing": typing,
                },
            )

    async def chat_message(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "message": event["message"],
                    "user": event["user"],
                    "online_users": event.get("online_users", []),
                    "online_count": event.get("online_count", 0),
                }
            )
        )

    async def user_typing(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "typing": event["typing"],
                    "user": event["user"],
                    "type": "typing",
                }
            )
        )

    async def send_online_user_count(self):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": "",
                "user": "system",
                "online_users": list(self.connected_users),
                "online_count": len(self.connected_users),
            },
        )

    @database_sync_to_async
    def save_message(self, user, room_name, message):
        room, _ = ChatRoom.objects.get_or_create(name=room_name)
        return Message.objects.create(room=room, user=user, content=message)
