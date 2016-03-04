#!usr/bin/python
# -*- coding: utf-8 -*-

from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils.translation import ugettext_lazy as _


class MyUserManager(BaseUserManager):

    def create_user(self, username, password):
        """
        Creates and saves a user
        """
        user = self.model(
            username = username
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password):
        """
        Creates and saves a superuser
        """
        user = self.create_user(
            username = username,
            password = password
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    """
    User profile which extends AbstracUser
    AbstractBaseUser contains basic fields like password and last_login
    """
    username = models.CharField(
        verbose_name = _('Username'),
        max_length = 255,
        unique = True,
        null = False
    )
    is_active = models.BooleanField(
        verbose_name = _('Active'),
        default = True
    )
    is_admin = models.BooleanField(
        verbose_name = _('Admin'),
        default = False
    )
    date_joined = models.DateTimeField(
        verbose_name = _('Joined datetime'),
        auto_now_add = True,
        editable = False
    )

    objects = MyUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = _('User')
        verbose_name_plural = _('Users')
        ordering = ['-id']   

    def __unicode__(self):
        return unicode(self.id) or u''

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin


class Comment(models.Model):
    """
    Comment information
    """
    nickname = models.CharField(
        verbose_name = _('nickname'),
        max_length = 10
    )
    content = models.TextField(
        verbose_name = _('Content'),
    ) 
    ip_address = models.GenericIPAddressField(
        verbose_name = _('IP address'),
        blank = True,
        null = True
    )
    is_abusing = models.BooleanField(
        verbose_name = _('Abusing'),
        default = False
    )
    speaker = models.CharField(
        verbose_name = _('Speaker'),
        max_length = 10,
        blank = True,
        null = True
    )
    spoken_at = models.DateField(
        verbose_name = _('Spoken date'),
        blank = True,
        null = True
    )
    created_at = models.DateTimeField(
        verbose_name = _('Created datetime'),
        auto_now_add = True,
        editable = False
    )
    updated_at = models.DateTimeField(
        verbose_name = _('Updated datetime'),
        auto_now = True
    )

    class Meta:
        verbose_name = _('Comment')
        verbose_name_plural = _('Comments')
        ordering = ['id']

    def __unicode__(self):
        return unicode(self.id) or u''
