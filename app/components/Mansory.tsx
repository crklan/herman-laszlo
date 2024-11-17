import type {Painting} from '~/types/painting'

import {ImagePreview} from './ImagePreview'

export const Mansory = ({paintings}: {paintings: Painting[]}) => {
  const firstColumn = paintings.filter((_, i) => i % 3 === 0)
  const secondColumn = paintings.filter((_, i) => i % 3 === 1)
  const thirdColumn = paintings.filter((_, i) => i % 3 === 2)

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-20">
      <div className="grid gap-4">
        {firstColumn.map((painting: Painting) => (
          <ImagePreview key={painting._id} data={painting} />
        ))}
      </div>

      <div className="grid gap-4">
        {secondColumn.map((painting: Painting) => (
          <ImagePreview key={painting._id} data={painting} />
        ))}
      </div>

      <div className="grid gap-4">
        {thirdColumn.map((painting: Painting) => (
          <ImagePreview key={painting._id} data={painting} />
        ))}
      </div>
    </div>
  )
}
