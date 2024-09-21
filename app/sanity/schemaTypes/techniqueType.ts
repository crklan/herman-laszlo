import {defineField, defineType} from 'sanity'

export const techniqueType = defineType({
  name: 'technique',
  title: 'Technique',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name'},
    }),
  ],
})
