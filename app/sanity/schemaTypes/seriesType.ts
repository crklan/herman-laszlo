import {defineField, defineType} from 'sanity'

export const seriesType = defineType({
  name: 'series',
  title: 'Series',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name'},
    }),
    defineField({
      name: 'description',
      type: 'internationalizedArrayText',
    }),
  ],
  preview: {
    select: {
      name: 'name',
    },
    prepare(selection) {
      const {name} = selection

      // Extract English translation from internationalized array
      const getLocalizedValue = (
        internationalizedArray: any[],
        locale: string,
      ) => {
        const localizedItem = internationalizedArray?.find(
          (item) => item._key === locale,
        )
        return (
          localizedItem?.value ||
          internationalizedArray?.[0]?.value ||
          'Untitled'
        )
      }

      return {
        title: Array.isArray(name)
          ? getLocalizedValue(name, 'en')
          : name || 'Untitled',
      }
    },
  },
})
