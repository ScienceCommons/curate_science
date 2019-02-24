from curate.models import Article
from django.shortcuts import render

def index(request):
    articles = Article.objects.order_by('updated')[:10]
    return render(request, 'index.html', {'articles': articles})

# Endpoint for redesigned pages
def router_index(request, *args, **kwargs):
    # Get logged in user
    auth_js = 'true' if request.user.is_authenticated else 'false'
    session_data = {
        'authenticated': auth_js,
        'username': request.user
    }
    return render(request, 'router_index.html', session_data)

