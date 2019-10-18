from django.shortcuts import get_object_or_404, render

from curate.models import Author


def author_embed(request, *args, **kwargs):
    slug = kwargs.get('slug')

    # Return a 404 if no Author matching that slug is found
    get_object_or_404(Author, slug=slug)

    # Else return the embed script
    return render(
        request,
        'author_embed.js',
        {'slug': slug},
        content_type='application/javascript'
    )
