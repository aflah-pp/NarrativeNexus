from rest_framework import serializers
from .models import Story, Chapter, Comment, Notification, Tag
from django.conf import settings
from django.contrib.auth import get_user_model


User = get_user_model()

#-----------------COMMENT SERIALIZER--------------------------------

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    def validate_content(self, value):
        if len(value.strip()) < 1:
            raise serializers.ValidationError("Comment cannot be empty.")
        if len(value) > 1000:
            raise serializers.ValidationError("Comment cannot exceed 1000 characters.")
        return value

    class Meta:
        model = Comment
        fields = ['id', 'user', 'content', 'created_at', 'updated_at']


#-----------------CHAPTER SERIALIZER--------------------------------

class ChapterSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if data.get('chapter_no', 0) <= 0:
            raise serializers.ValidationError("Chapter number must be positive.")
        if not data.get('title').strip():
            raise serializers.ValidationError("Chapter title cannot be empty.")
        return data

    class Meta:
        model = Chapter
        fields = '__all__'


#-----------------STORY LIST SERIALIZER (Lightweight)--------------------------------

class StoryListSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    cover_image_url = serializers.SerializerMethodField()
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    bookmarks_count = serializers.IntegerField(source='bookmarks.count', read_only=True)
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Story
        fields = [
            'id', 'title', 'genre', 'cover_image_url', 'status',
            'author', 'likes_count', 'bookmarks_count', 'tags', 'created_at'
        ]

    def get_cover_image_url(self, obj):
        if obj.cover_image:
            return obj.cover_image.url.replace("/upload/", "/upload/q_auto,f_auto,w_600/")
        return None

    def get_tags(self, obj):
        return [tag.name for tag in obj.tags.all()]


#-----------------STORY DETAIL SERIALIZER (Full)--------------------------------

class StorySerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    cover_image_url = serializers.SerializerMethodField()
    chapters = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    bookmarks_count = serializers.IntegerField(source='bookmarks.count', read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    bookmarks = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.all(),
        required=False
    )

    class Meta:
        model = Story
        fields = [
            'id', 'title', 'genre', 'synopsis', 'cover_image', 'cover_image_url', 'status',
            'is_serialized', 'author', 'created_at', 'updated_at',
            'tags', 'chapters', 'bookmarks',
            'likes_count', 'bookmarks_count', 'comments'
        ]

    def get_cover_image_url(self, obj):
        if obj.cover_image:
            return obj.cover_image.url.replace("/upload/", "/upload/q_auto,f_auto,w_600/")
        return None

    def get_chapters(self, obj):
        request = self.context.get('request')
        user = request.user if request else None
        chapters = obj.chapters.all() if user == obj.author else obj.chapters.filter(is_published=True)
        return ChapterSerializer(chapters, many=True).data

    def get_tags(self, obj):
        return [tag.name for tag in obj.tags.all()]

    def validate_tags_input(self, tags_list):
        if len(tags_list) > 10:
            raise serializers.ValidationError("A story cannot have more than 10 tags.")
        return [tag.strip() for tag in tags_list if tag.strip()]

    def create(self, validated_data):
        request = self.context.get("request")
        tags_data = []
        bookmarks_data = validated_data.pop("bookmarks", [])

        if request:
            if hasattr(request.data, "getlist"):
                tags_data = request.data.getlist("tags[]") or request.data.getlist("tags")
            else:
                tags_data = request.data.get("tags", [])

        tags_data = self.validate_tags_input(tags_data)

        story = Story.objects.create(**validated_data)

        if tags_data:
            tag_objs = [Tag.objects.get_or_create(name=tag)[0] for tag in tags_data]
            story.tags.set(tag_objs)

        if bookmarks_data:
            story.bookmarks.set(bookmarks_data)

        return story

    def update(self, instance, validated_data):
        request = self.context.get("request")
        tags_data = []
        bookmarks_data = validated_data.pop("bookmarks", None)

        if request:
            if hasattr(request.data, "getlist"):
                tags_data = request.data.getlist("tags[]") or request.data.getlist("tags")
            else:
                tags_data = request.data.get("tags", [])

        tags_data = self.validate_tags_input(tags_data)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if tags_data:
            tag_objs = [Tag.objects.get_or_create(name=tag)[0] for tag in tags_data]
            instance.tags.set(tag_objs)

        if bookmarks_data is not None:
            instance.bookmarks.set(bookmarks_data)

        return instance


#-----------------NOTIFICATION SERIALIZER--------------------------------

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'message', 'url', 'is_read', 'created_at']