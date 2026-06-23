import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'writings',
  title: 'Writings',
  type: 'document',
  liveEdit: false,
  fields: [
    defineField({
      type: 'string',
      name: 'title',
      title: 'Title',
      description: 'This field is the title of your writings section.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: 'object',
      name: 'heading',
      title: 'Heading',
      description: 'The heading for work section.',
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
      title: 'Writings',
      description: 'This field is for all your writings',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'writing',
          title: 'Writing',
          fields: [
            defineField({
              type: 'string',
              name: 'title',
              title: 'Title',
              description: 'This field is the title of your writings section.',
            }),
            defineField({
              type: 'image',
              name: 'image',
              title: 'Image',
              options: {
                hotspot: true,
              },
              description: 'This image will be used as the cover image for the writing.',
            }),
            defineField({
              type: 'text',
              name: 'heading',
              title: 'Heading',
              description: 'This image will be used as the heading for the writing.',
            }),
            defineField({
              type: 'text',
              name: 'body',
              title: 'Body',
              description: 'This image will be used as the body for the writing.',
            }),
            defineField({
              type: 'url',
              name: 'link',
              title: 'URL',
              description: 'This image will be used as the link for the writing.',
            }),
          ],
        }),
      ],
    }),
  ],
})
