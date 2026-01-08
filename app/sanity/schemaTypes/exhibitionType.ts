import {Calendar} from 'lucide-react'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const exhibitionType = defineType({
  name: 'exhibition',
  title: 'Exhibition',
  type: 'document',
  icon: Calendar,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      validation: (Rule) => Rule.required().min(Rule.valueOfField('startDate')),
    }),
    defineField({
      name: 'location',
      title: 'Location/Venue',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'exhibitionPhotos',
      title: 'Exhibition Photos',
      description: 'Photos from the exhibition venue and installations',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            }),
            defineField({
              name: 'caption',
              type: 'internationalizedArrayString',
              title: 'Caption',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      description: 'Optional video URL (YouTube, Vimeo, etc.)',
      type: 'url',
    }),
    defineField({
      name: 'relatedSeries',
      title: 'Related Series',
      description: 'Series featured in this exhibition',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'series'}]}],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      location: 'location',
      startDate: 'startDate',
      media: 'coverImage',
    },
    prepare(selection) {
      const {title, location, startDate, media} = selection
      const getLocalizedValue = (arr: any[], locale = 'en') => {
        const item = arr?.find((i) => i._key === locale)
        return item?.value || arr?.[0]?.value || 'Untitled'
      }
      const titleText = Array.isArray(title)
        ? getLocalizedValue(title)
        : title || 'Untitled'
      const year = startDate ? new Date(startDate).getFullYear() : 'No date'
      return {
        title: titleText,
        subtitle: `${location} • ${year}`,
        media,
      }
    },
  },
})
