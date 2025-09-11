import {defineField, defineType} from 'sanity'

export const paintingType = defineType({
  name: 'painting',
  title: 'Painting',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'techniques',
      type: 'reference',
      to: [{type: 'technique'}],
    }),
    defineField({
      name: 'series',
      type: 'reference',
      to: [{type: 'series'}],
    }),
    defineField({
      name: 'height',
      type: 'number',
    }),
    defineField({
      name: 'width',
      type: 'number',
    }),
    defineField({
      name: 'year',
      type: 'number',
    }),
    defineField({
      name: 'description',
      type: 'text',
    }),
    defineField({
      name: 'image',
      type: 'image',
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
    }),
    defineField({
      name: 'location',
      type: 'string',
      options: {
        list: [
          {title: 'Ljubljana', value: 'Ljubljana'},
          {title: 'Lendava', value: 'Lendava'},
        ],
      },
    }),
    defineField({
      name: 'sold',
      type: 'boolean',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      seriesName: 'series.name',
    },
    prepare({title, seriesName}) {
      return {
        title: Array.isArray(title)
          ? (title.find((t: any) => t._key === 'en')?.value ??
            title[0]?.value ??
            'Untitled')
          : title || 'Untitled',
        subtitle:
          seriesName.find((s: any) => s.value != null || s.value != undefined)
            ?.value || 'Untitled',
      }
    },
  },
})
