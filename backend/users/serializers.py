from rest_framework import serializers
from .models import CustomUser,Follow
from django.contrib.auth.password_validation import validate_password


#-----------------REGISTER SERIALIZER--------------------------------

class UserRegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password', 'password2', 'profile_image', 'bio']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords don’t match homie."})
        validate_password(attrs['password'])
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(**validated_data)
        return user


#-----------------USER SERIALIZER--------------------------------

class UserSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    profile_image_url = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'first_name', 'last_name', 'email', 
            'bio', 'followers_count', 'following_count', 'profile_image',
            'profile_image_url'
        ]

    def get_followers_count(self, obj):
        return obj.followers_set.count()

    def get_following_count(self, obj):
        return obj.following_set.count()

    def get_profile_image_url(self, obj):
        if obj.profile_image:
            return obj.profile_image.url.replace("/upload/", "/upload/q_auto,f_auto,w_600/")

        return None



#-----------------FOLLOW SERIALIZER--------------------------------

class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = ['id', 'follower', 'following', 'followed_at']

#-----------------Public User SERIALIZER--------------------------------


class PublicUsersSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()
    profile_image_url = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'first_name', 'last_name', 
            'bio', 'followers_count', 'following_count', 
            'is_following', 'profile_image','profile_image_url'
        ]

    def get_followers_count(self, obj):
        return obj.followers_set.count()

    def get_following_count(self, obj):
        return obj.following_set.count()

    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Follow.objects.filter(follower=request.user, following=obj).exists()
        return False

    def get_profile_image_url(self, obj):
        if obj.profile_image:
            return obj.profile_image.url.replace("/upload/", "/upload/q_auto,f_auto,w_600/")
        return None
