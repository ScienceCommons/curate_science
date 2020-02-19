import React from 'react'
import { Carousel } from 'react-responsive-carousel';

import { FancyBoxViewer } from 'util/fancybox'


export default function MiniFigureViewer({ figures }) {
  if (!figures.length) return null

  const viewer = FancyBoxViewer({ hash: null })

  const imageURLs = figures.map(figure => { return { src: figure.image } })

  const expand = function(event) {
    event.preventDefault()
    const index = event.target.dataset.index || 0
    viewer.show_image(imageURLs, index)
  }

  const multipleFigures = figures.length > 0

  return (
    <Carousel
      autoPlay={false}
      infiniteLoop={true}
      showStatus={false}
      showThumbs={false}
      showArrows={multipleFigures}
      showIndicators={false}
      className="MiniFigureViewer"
    >
      {
        figures.map((figure, index) => {
          return (
            <a
              href={figure.image}
              key={figure.id}
              style={{ display: 'block', height: '100%' }}
              onClick={expand}
              data-index={index}
            >
              <img src={figure.image} style={{ height: 80, width: 80, objectFit: 'cover' }}/>
            </a>
          )
        })
      }
    </Carousel>
  )
}
