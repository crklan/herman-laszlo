import {useFetcher} from '@remix-run/react'
import {useEffect, useMemo, useRef, useState} from 'react'

import type {Painting} from '~/types/painting'

import {ImagePreview} from './ImagePreview'

export interface MansoryProps {
  initialPaintings: Painting[]
  totalCount: number
  apiEndpoint: string // Generic API endpoint
}

export const Mansory = ({
  initialPaintings,
  totalCount,
  apiEndpoint,
}: MansoryProps) => {
  const [paintings, setPaintings] = useState(initialPaintings)
  const [hasMore, setHasMore] = useState(paintings.length < totalCount)
  const fetcher = useFetcher<{paintings: Painting[]}>()
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Calculate optimal image height for layout (normalized to consistent width)
  const getImageHeight = (painting: Painting) => {
    if (!painting.width || !painting.height) return 300 // fallback height
    const aspectRatio = painting.height / painting.width
    const normalizedWidth = 300 // base width for calculation
    return Math.min(normalizedWidth * aspectRatio, 500) // max height of 500px
  }

  // Distribute paintings to columns using masonry algorithm
  const columns = useMemo(() => {
    const columnCount = 3
    const cols: Painting[][] = Array.from({length: columnCount}, () => [])
    const columnHeights = Array.from({length: columnCount}, () => 0)

    paintings.forEach((painting) => {
      // Find the shortest column
      const shortestColumnIndex = columnHeights.indexOf(
        Math.min(...columnHeights),
      )

      // Add painting to shortest column
      cols[shortestColumnIndex].push(painting)

      // Update column height (including gap)
      columnHeights[shortestColumnIndex] += getImageHeight(painting) + 64 // 64px = gap-16 in pixels
    })

    return cols
  }, [paintings])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && fetcher.state === 'idle') {
          const urlWithParams = `${apiEndpoint}?offset=${paintings.length}&limit=20`
          fetcher.load(urlWithParams)
        }
      },
      {threshold: 0.1},
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, paintings.length, fetcher, apiEndpoint])

  // Update paintings when new data arrives
  useEffect(() => {
    if (fetcher.data?.paintings) {
      const newPaintings = fetcher.data.paintings

      if (newPaintings.length > 0) {
        setPaintings((prev) => {
          const updatedPaintings = [...prev, ...newPaintings]
          setHasMore(updatedPaintings.length < totalCount)
          return updatedPaintings
        })
      } else {
        setHasMore(false)
      }
    }
  }, [fetcher.data, totalCount])

  return (
    <>
      {/* Mobile: Single column */}
      <div className="flex flex-col gap-16 mt-20 md:hidden">
        {paintings.map((painting: Painting) => (
          <ImagePreview key={painting._id} data={painting} isPreview={false} />
        ))}
      </div>

      {/* Desktop: Three columns with masonry */}
      <div className="hidden md:flex gap-16 mt-20 items-start">
        {columns.map((columnPaintings, columnIndex) => (
          <div key={columnIndex} className="flex-1 flex flex-col gap-16">
            {columnPaintings.map((painting: Painting) => (
              <ImagePreview
                key={painting._id}
                data={painting}
                isPreview={false}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Loading trigger element */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {fetcher.state === 'loading' ? (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
              Loading more paintings...
            </div>
          ) : (
            <div className="h-4" />
          )}
        </div>
      )}
    </>
  )
}
