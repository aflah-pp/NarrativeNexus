from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserRegisterSerializer, UserSerializer, PublicUsersSerializer, FollowSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics, permissions, status
from .models import CustomUser, Follow
from rest_framework.views import APIView

#-----------------REGISTER USER--------------------------------

class UserRegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Create JWT tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user, context=self.get_serializer_context()).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


#--------Logged in user can edit own profile--------------------

class UserUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


#-------------------View all public users (Explore)------------------------

class PublicUserListView(generics.ListAPIView):
    serializer_class = PublicUsersSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CustomUser.objects.exclude(id=self.request.user.id)

    
#-----------------View public user details-------------------------------

class PublicUserDetailView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = PublicUsersSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'


#-----------------Follow View--------------------------------

class FollowUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        user_to_follow = generics.get_object_or_404(CustomUser, username=username)

        if user_to_follow == request.user:
            return Response({'detail': "You can't follow yourself."}, status=400)

        _, created = Follow.objects.get_or_create(
            follower=request.user,
            following=user_to_follow
        )

        if not created:
            return Response({'detail': "You're already following."}, status=400)

        return Response({'detail': 'Followed successfully.'}, status=201)


#-----------------UnFollow View--------------------------------

class UnfollowUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        user_to_unfollow = generics.get_object_or_404(CustomUser, username=username)

        if user_to_unfollow == request.user:
            return Response({'detail': "You can't unfollow yourself."}, status=400)

        follow_relation = Follow.objects.filter(
            follower=request.user,
            following=user_to_unfollow
        ).first()

        if follow_relation:
            follow_relation.delete()
            return Response({'detail': 'Unfollowed successfully.'}, status=200)
        else:
            return Response({'detail': "You're not following this user."}, status=400)


#-----------------Followers View--------------------------------

class FollowersListView(generics.ListAPIView):
    serializer_class = PublicUsersSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        username = self.kwargs['username']
        user = generics.get_object_or_404(CustomUser, username=username)
        return CustomUser.objects.filter(following_set__following=user)


#-----------------Following View--------------------------------

class FollowingListView(generics.ListAPIView):
    serializer_class = PublicUsersSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        username = self.kwargs['username']
        user = generics.get_object_or_404(CustomUser, username=username)
        return CustomUser.objects.filter(followers_set__follower=user)
