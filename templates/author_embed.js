var iframe = document.createElement('iframe');
iframe.setAttribute('src', 'http://localhost:8000/app/author-embed/{{ slug }}');
iframe.setAttribute('width', '100%');
iframe.setAttribute('height', '1000px');

var thisScript = document.currentScript
thisScript.parentNode.insertBefore(iframe, thisScript.nextSibling);
