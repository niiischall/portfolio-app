import {defineField, defineType} from 'sanity'

export default defineType({
  type: 'document',
  name: 'navigation',
  title: 'Navigation',
  fields: [
    defineField({
      type: 'string',
      name: 'title',
      title: 'Title',
      description: 'This field is the heading of the navigation.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: 'object',
      name: 'heading',
      title: 'Heading',
      description: 'The heading for navigation',
      fields: [
        defineField({
          type: 'string',
          name: 'title',
          title: 'Title',
        }),
        defineField({
          type: 'slug',
          name: 'slug',
          title: 'Slug',
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: 'array',
      name: 'collection',
      title: 'Navigation Items List',
      description: 'Section links displayed on the navigation.',
      of: [
        defineField({
          type: 'object',
          name: 'item',
          title: 'Navigation Link',
          fields: [
            defineField({
              type: 'string',
              name: 'title',
              title: 'Title',
            }),
            defineField({
              type: 'slug',
              name: 'slug',
              title: 'Slug',
            }),
          ],
        }),
      ],
    }),
  ],
})
