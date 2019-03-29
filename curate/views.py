from curate.models import Article
from curate.serializers import AuthorSerializer
from django.shortcuts import render
from django.core import serializers
import json

def index(request):
    articles = Article.objects.order_by('updated')[:10]
    return render(request, 'index.html', {'articles': articles})

# Endpoint for redesigned pages
def router_index(request, *args, **kwargs):
    # Get logged in user
    user_session = {
        'authenticated': False
    }
    if request.user:
        user_session.update({
            'username': request.user.username,
            'admin': request.user.is_staff,
            'authenticated': request.user.is_authenticated
        })
        if hasattr(request.user, 'author'):
            # TODO: Check here if author page is_activated?
            serialized = AuthorSerializer(request.user.author).data
            if serialized['is_activated']:
                user_session['author'] = serialized
    session_data = {
        'user_session_json': json.dumps(user_session)
    }
    return render(request, 'router_index.html', session_data)
