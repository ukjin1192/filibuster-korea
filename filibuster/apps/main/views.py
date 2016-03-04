#!usr/bin/python
# -*- coding:utf-8 -*-

from captcha.models import CaptchaStore
from django.conf import settings
from django.db.models.functions import Length
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_protect 
from django.views.decorators.http import require_http_methods
from firebase import firebase
from main.models import User, Comment

FIREBASE_USERNAME = getattr(settings, 'FIREBASE_USERNAME')
FIREBASE_REPO_URL = getattr(settings, 'FIREBASE_REPO_URL')
FIREBASE_API_SECRET = getattr(settings, 'FIREBASE_API_SECRET')

# Firebase configuration 
authentication = firebase.FirebaseAuthentication(FIREBASE_API_SECRET, FIREBASE_USERNAME, True, True)
firebase_obj = firebase.FirebaseApplication(FIREBASE_REPO_URL, authentication)


@csrf_protect
@require_http_methods(['POST'])
def create_comment(request):
    """
    Create comment if captcha input is valid
    """
    if all(x in request.POST for x in ['nickname', 'content', 'captcha_key', 'captcha_value']):
        
        # Human validation by captcha form
        captcha_key = request.POST['captcha_key']
        captcha_value = request.POST['captcha_value']
        
        try:
            captcha = CaptchaStore.objects.get(challenge=captcha_value, hashkey=captcha_key)
            captcha.delete()
        except:
            return JsonResponse({'state': 'fail', 'msg': 'Captcha input is not valid'})
        
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip_address = x_forwarded_for.split(',')[0]
        else:
            ip_address = request.META.get('REMOTE_ADDR')
        
        comment = Comment(nickname=request.POST['nickname'], content=request.POST['content'], ip_address=ip_address)
        comment.save()
        
        update_firebase_database('/comment', 'last_comment_id', comment.id)
        
        return JsonResponse({'state': 'success', 'msg': 'Succeed to create comment', 'comment_id': comment.id})
        
    else:
        return HttpResponse(status=400)


@require_http_methods(['GET'])
def get_comments(request):
    """
    Get comments with (1) ordering (2) filtering (3) number of comments options
    """
    comments = Comment.objects.all()

    #try:
    # Ordering
    if 'ordering' in request.GET:
        if request.GET['ordering'] == 'desc':
            comments = comments.order_by('-id')
        elif request.GET['ordering'] == 'random':
            comments = comments.order_by('?')
        else:
            comments = comments.order_by('id')
    else:
        comments = comments.order_by('id')
    
    # Filtering options
    if 'id' in request.GET:
        comments = comments.filter(id=request.GET['id'])
    if 'nickname' in request.GET:
        comments = comments.filter(nickname__contains=request.GET['nickname'])
    if 'content' in request.GET:
        comments = comments.filter(content__contains=request.GET['content'])
    if 'is_spoken' in request.GET:
        comments = comments.annotate(speaker_length=Length('speaker')).filter(speaker_length__gt=0)
    if 'speaker' in request.GET:
        comments = Comment.objects.filter(speaker=request.GET['speaker'])
    if 'is_abusing' in request.GET:
        objects.annotate(text_len=Length('text')).filter(
                    text_len__gt=10)
        comments = Comment.objects.filter(is_abusing=True)
    if 'first_comment_id' in request.GET:
        comments = comments.filter(id__gte=int(request.GET['first_comment_id'])) 
    if 'last_comment_id' in request.GET:
        comments = comments.filter(id__lte=int(request.GET['last_comment_id'])) 
    if 'originally_last_comment_id' in request.GET:
        if 'ordering' in request.GET and request.GET['ordering'] == 'desc':
            comments = comments.filter(id__lt=int(request.GET['originally_last_comment_id'])) 
        else:
            comments = comments.filter(id__gt=int(request.GET['originally_last_comment_id'])) 

    # Number of comments
    number_of_comments = getattr(settings, 'MAX_COMMENTS_PER_QUERYSET')
    if 'number_of_comments' in request.GET:
        number_of_comments = min(int(request.GET['number_of_comments']), getattr(settings, 'MAX_COMMENTS_PER_QUERYSET'))
    comments = comments[:number_of_comments]
    
    # Serialize data
    comments = list(comments.values('id', 'nickname', 'content', 'ip_address', 'speaker', 'spoken_at', 'created_at'))

    # Encrypt IP address
    for comment in comments:
        if comment['ip_address'] != None:
            ip_address = comment['ip_address']
            ip_address = ip_address.split('.')
            ip_address[-1] = '**'
            comment['ip_address'] = '.'.join(ip_address)
    
    return JsonResponse({'comments': comments})
            
    #except:
    #    return HttpResponse(status=400)


def update_firebase_database(permalink, key, value):
    """
    Update Firebase database
    """
    firebase_obj.put(permalink, key, value)
    return None
