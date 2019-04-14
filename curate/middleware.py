from django.http import HttpResponseRedirect

def no_www_middleware(get_response):

    def middleware(request):
        response = get_response(request)
        if request.method == 'GET':
            host = request.get_host()
            if host.lower().find('www.') == 0:
                no_www_host = host[4:]
                url = request.build_absolute_uri().replace(host, no_www_host, 1)
                return HttpResponseRedirect(url)
        return response

    return middleware
