import React, { useEffect, useState } from 'react'
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

  const onChange = function(visibleIndex) {
    setCurrentFigure(visibleIndex)
    markFiguresVisible(visibleIndex)
  }

  // Track which figures should be rendered to a allow lazy-loading of images
  // If a figure's index isn't in the visibleFigures set, the image isn't loaded
  // We add the first image to the set by default
  const [visibleFigures, setVisibleFigures] = useState(new Set([0]))
  const [currentFigure, setCurrentFigure] = useState(0)

  const markFiguresVisible = function(index) {
    // Add the figures before and after the current index to the set of visible figures
    if (index > figures.length - 1 || index < 0) return

    const nextIndex = (index + 1) % figures.length
    const prevIndex = (index - 1 + figures.length) % figures.length

    visibleFigures.add(index)
    visibleFigures.add(prevIndex)
    visibleFigures.add(nextIndex)

    // We have to create a new Set here to force React to rerender
    setVisibleFigures(new Set(visibleFigures))
  }
  useEffect(() => {
    // Load the figures before and after the first image after the initial render
    markFiguresVisible(0)
  }, [])

  return (
    <div style={{ height: 80, width: 80 }}>
      <Carousel
        autoPlay={false}
        infiniteLoop={true}
        showStatus={false}
        showThumbs={false}
        showArrows={multipleFigures}
        showIndicators={false}
        className="MiniFigureViewer"
        onChange={onChange}
        selectedItem={currentFigure}
      >
        {
          figures.map((figure, index) => {
            return (
              <a
                href={figure.image}
                key={figure.id}
                style={{ display: 'block', height: '100%', backgroundColor: 'white' }}
                onClick={expand}
                data-index={index}
              >
                <img 
                  src={visibleFigures.has(index) ? figure.image : null}
                  style={{ height: 80, width: 80, objectFit: 'cover' }}
                />
              </a>
            )
          })
        }
      </Carousel>
    </div>
  )
}
