export function FancyBoxViewer({ initial_images, hash }) {
  // Helper function used to render FancyBox galleries.
  // The `initial_images` are used to show a shared image on page load if one is specified,
  // the `hash` is used to specify the group of images in the gallery.
  //
  // The function returns an object with the `show_image(images, index)` function
  // that can be called to open the FancyBox viewer.

  function load_jquery_and_fancybox() {
      // Check if it's already loaded
      if (window.jQuery && window.jQuery.fancybox) return

      window.jQuery = window.$ = require('jquery')
      require('@fancyapps/fancybox')
  }

  const options = {
    hash,
    loop: true,
    buttons: [
      'zoom',
      'share',
      'fullScreen',
      'slideShow',
      'thumbs',
      'close',
    ],
  }

  function show_image(images, index) {
    if (!window.$) return
    window.$.fancybox.open(images, options, index)
  }

  load_jquery_and_fancybox()

  // Check if the page is loading a fancybox image
  // e.g. /app/home/#gallery-2
  const initial_images_specified = initial_images && initial_images.length
  if (initial_images_specified && window.location.hash) {
    const index = window.location.hash.split(`${hash}-`)[1]
    if (index) {
      show_image(initial_images, Number(index) - 1)
    }
  }

  return {
    show_image,
  }
}
