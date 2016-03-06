#!usr/bin/python
# -*- coding: utf-8 -*-

from django.contrib import admin
from main.models import User, Comment


class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'is_active', 'is_admin')
    search_fields = ('username', )
    ordering = ('-id', )


class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'nickname', 'content', 'ip_address', 'category', 'speaker', 'spoken_at', 'created_at', 'updated_at')
    search_fields = ('id', 'nickname', 'content', 'ip_address', 'category', 'speaker')
    ordering = ('-id', )


admin.site.register(User, UserAdmin)
admin.site.register(Comment, CommentAdmin)
