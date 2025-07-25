import {useFetcher} from '@remix-run/react'
import {useEffect, useRef, useState} from 'react'

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

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && fetcher.state === 'idle') {
          // Create the URL with query parameters - use relative path
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

      // Only update if we actually have new paintings
      if (newPaintings.length > 0) {
        setPaintings((prev) => {
          const updatedPaintings = [...prev, ...newPaintings]
          // Update hasMore based on the new total
          setHasMore(updatedPaintings.length < totalCount)
          return updatedPaintings
        })
      } else {
        // No more paintings available
        setHasMore(false)
      }
    }
  }, [fetcher.data, totalCount])

  // Distribute paintings across columns
  const firstColumn = paintings.filter((_, i) => i % 3 === 0)
  const secondColumn = paintings.filter((_, i) => i % 3 === 1)
  const thirdColumn = paintings.filter((_, i) => i % 3 === 2)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mt-20">
        <div className="grid gap-16">
          {firstColumn.map((painting: Painting) => (
            <ImagePreview
              key={painting._id}
              data={painting}
              isPreview={false}
            />
          ))}
        </div>

        <div className="grid gap-16">
          {secondColumn.map((painting: Painting) => (
            <ImagePreview
              key={painting._id}
              data={painting}
              isPreview={false}
            />
          ))}
        </div>

        <div className="grid gap-16">
          {thirdColumn.map((painting: Painting) => (
            <ImagePreview
              key={painting._id}
              data={painting}
              isPreview={false}
            />
          ))}
        </div>
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
            <div className="h-4" /> // Invisible trigger element
          )}
        </div>
      )}
    </>
  )
}
