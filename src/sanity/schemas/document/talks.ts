import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  type: 'document',
  name: 'talks',
  title: 'Talks',
  fields: [
    defineField({
      type: 'string',
      name: 'title',
      title: 'Title',
      description: 'This field is the title of your talks section.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: 'object',
      name: 'heading',
      title: 'Heading',
      description: 'The heading for experiments section.',
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
      name: 'collection',
      title: 'Talks',
      description: 'This field is for all your talks',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'talk',
          title: 'Talk',
          fields: [
            defineField({
              type: 'string',
              name: 'title',
              title: 'Title',
              description: 'This field is the title of your talk section.',
            }),
            defineField({
              type: 'text',
              name: 'heading',
              title: 'Heading',
              description: 'This field is the heading of your talk section.',
            }),
            defineField({
              type: 'text',
              name: 'body',
              title: 'Body',
              description: 'This field is the body of your talk section.',
            }),
            defineField({
              type: 'object',
              name: 'link',
              title: 'Link',
              description: 'This field is the link of your talk section.',
              fields: [
                defineField({
                  type: 'text',
                  name: 'text',
                  title: 'Title',
                }),
                defineField({
                  type: 'url',
                  name: 'url',
                  title: 'URL',
                }),
              ],
            }),
            defineField({
              type: 'image',
              name: 'cover',
              title: 'Image',
              options: {
                hotspot: true,
              },
              description: 'This image will be used as the cover image for the talk.',
            }),
          ],
        }),
      ],
    }),
  ],
})
