from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import ChatRoom, Message
from .serializers import MessageSerializer  



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def chat_messages(request, room_name="global"):
    try:
        room = ChatRoom.objects.get(name=room_name)
        messages = Message.objects.filter(room=room).order_by("timestamp")
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    except ChatRoom.DoesNotExist:
        return Response({"error": "Room not found"}, status=404)
