import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  type: 'document',
  name: 'about',
  title: 'About',
  liveEdit: false,
  fields: [
    defineField({
      type: 'string',
      name: 'title',
      title: 'Title',
      description: 'This field is the title of your about section.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: 'object',
      name: 'heading',
      title: 'Heading',
      description: 'The heading for about section.',
      fields: [
        defineField({
          name: 'title',
          description: 'Used for heading on the about section',
          title: 'Text',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [{title: 'H2', value: 'h2'}],
              marks: {
                decorators: [{title: 'Strong', value: 'strong'}],
              },
            },
          ],
          validation: (rule) => rule.max(100).required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: 'array',
      name: 'overview',
      title: 'Overview',
      description: 'Used for overview in about section and associated link',
      of: [
        defineArrayMember({
          type: 'block',
          marks: {
            annotations: [
              {
                type: 'object',
                name: 'link',
                title: 'Link',
                fields: [
                  {
                    type: 'url',
                    name: 'href',
                    title: 'Url',
                  },
                ],
              },
            ],
            decorators: [
              {
                title: 'Strong',
                value: 'strong',
              },
            ],
          },
        }),
      ],
      validation: (rule) => rule.max(155).required(),
    }),
    defineField({
      type: 'object',
      name: 'cv',
      title: 'CV',
      description: 'The link for CV',
      fields: [
        defineField({
          type: 'string',
          name: 'title',
          title: 'Title',
        }),
        defineField({
          type: 'url',
          name: 'link',
          title: 'URL',
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
})
