import {defineField, defineType} from 'sanity'

export const paintingType = defineType({
  name: 'painting',
  title: 'Painting',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
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
      name: 'length',
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
})
