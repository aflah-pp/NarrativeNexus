import os
import django

# ✅ Set up Django before importing anything that touches models/settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.backend.settings")
django.setup()

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from chat.middleware import TokenAuthMiddleware
import chat.routing
import stories.routing

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": TokenAuthMiddleware(
        URLRouter(
            chat.routing.websocket_urlpatterns +
            stories.routing.websocket_urlpatterns
        )
    ),
})
