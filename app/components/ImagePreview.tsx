import {Link} from '@remix-run/react'
import imageUrlBuilder from '@sanity/image-url'
import {useRef, useState} from 'react'

import {dataset, projectId} from '~/sanity/projectDetails'
import type {Painting} from '~/types/painting'

export const ImagePreview = ({
  data,
  isPreview = false,
}: {
  data: Painting
  isPreview: boolean
}) => {
  const [isZoomed, setIsZoomed] = useState(false)
  const [position, setPosition] = useState({x: 50, y: 50})
  const containerRef = useRef<HTMLDivElement>(null)
  const builder = imageUrlBuilder({projectId, dataset})

  if (!data) return <div></div>

  const updatePosition = (clientX: number, clientY: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100
    setPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updatePosition(e.clientX, e.clientY)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault()
    const touch = e.touches[0]
    updatePosition(touch.clientX, touch.clientY)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault()
    const touch = e.touches[0]
    updatePosition(touch.clientX, touch.clientY)
    setIsZoomed(true)
  }

  if (isPreview) {
    return (
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg cursor-zoom-in select-none"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => setIsZoomed(false)}
      >
        <img
          alt="Preview"
          className="object-contain max-h-[800px] rounded-lg transition-transform duration-200 ease-out"
          style={{
            transform: isZoomed ? 'scale(2)' : 'scale(1)',
            transformOrigin: `${position.x}% ${position.y}%`,
          }}
          src={builder
            .image(data.image)
            .quality(100)
            .auto('format')
            .fit('fillmax')
            .url()}
          draggable={false}
        />
        {isZoomed && (
          <>
            <div className="absolute inset-0 pointer-events-none" />
            {/* Touch indicator for mobile */}
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded md:hidden">
              Tap and drag to explore
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <Link
      prefetch="intent"
      className="flex justify-center object-contain"
      to={`/painting/${data._id}`}
    >
      <img
        alt="Preview"
        className="not-prose max-h-[500px] rounded-lg shadow-lg"
        src={builder.image(data.image).quality(40).fit('max').url()}
      />
    </Link>
  )
}
