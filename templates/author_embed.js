function getLocation(href) {
  var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
  return match && {
    href: href,
    protocol: match[1],
    host: match[2],
    hostname: match[3],
    port: match[4],
    pathname: match[5],
    search: match[6],
    hash: match[7]
  }
}

function authorURL(slug) {
  var href = document.currentScript.src;
  var location = getLocation(href);
  var port = location.port ? ':' + location.port : '';
  return location.protocol + '//' + location.hostname + port + '/app/author-embed/' + slug
}


var iframe = document.createElement('iframe');

iframe.setAttribute('src', authorURL('{{ slug }}'));
iframe.setAttribute('width', '100%');
iframe.setAttribute('height', '500px');

var thisScript = document.currentScript;
thisScript.parentNode.insertBefore(iframe, thisScript.nextSibling);

// Resize iframe when postMessage with height received
window.addEventListener('message', function(event) {
  var data = event.data
  if (!data.height) return
  iframe.setAttribute('height', data.height + 'px')
}, false)
