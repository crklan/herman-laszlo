import {useLingui} from '@lingui/react'
import {Link} from '@remix-run/react'
import imageUrlBuilder from '@sanity/image-url'
import {Calendar, MapPin} from 'lucide-react'

import {dataset, projectId} from '~/sanity/projectDetails'
import type {Exhibition} from '~/types/exhibition'

interface ExhibitionListItemProps {
  exhibition: Exhibition
}

export const ExhibitionListItem = ({exhibition}: ExhibitionListItemProps) => {
  const {i18n} = useLingui()
  const builder = imageUrlBuilder({projectId, dataset})

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(i18n.locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    const startYear = start.getFullYear()
    const endYear = end.getFullYear()

    const startMonth = start.toLocaleDateString(i18n.locale, {month: 'short'})
    const endMonth = end.toLocaleDateString(i18n.locale, {month: 'short'})

    if (startYear === endYear) {
      return `${startMonth} - ${endMonth} ${startYear}`
    } else {
      return `${startMonth} ${startYear} - ${endMonth} ${endYear}`
    }
  }

  return (
    <Link
      to={`/exhibition/${exhibition._id}`}
      className="flex flex-col md:flex-row gap-6 p-6 border border-border rounded-lg hover:border-foreground/20 transition-all group"
    >
      <div className="flex-shrink-0">
        {exhibition.coverImage ? (
          <img
            src={builder
              .image(exhibition.coverImage)
              .width(300)
              .height(200)
              .quality(80)
              .url()}
            alt={exhibition.title || 'Exhibition'}
            className="w-full md:w-[300px] h-[200px] object-cover rounded-lg"
          />
        ) : (
          <div className="w-full md:w-[300px] h-[200px] bg-muted rounded-lg" />
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-display text-2xl mb-1 group-hover:text-foreground/80 transition-colors">
            {exhibition.title}
          </h3>
          {exhibition.relatedSeries && exhibition.relatedSeries.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {exhibition.relatedSeries.map((series) => (
                <span
                  key={series._id}
                  className="text-xs px-2 py-1 bg-muted rounded"
                >
                  {series.name}
                </span>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-1 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{exhibition.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDate(exhibition.startDate)} -{' '}
                {formatDate(exhibition.endDate)}
              </span>
            </div>
          </div>

          {exhibition.description && (
            <p className="text-muted-foreground line-clamp-2">
              {exhibition.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 self-start md:self-center">
        <div className="font-display text-2xl md:text-3xl text-muted-foreground text-right">
          {formatDateRange(exhibition.startDate, exhibition.endDate)}
        </div>
      </div>
    </Link>
  )
}
