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
      type: 'object' as const,
      name: 'heading',
      title: 'Heading',
      description: 'The heading for work section.',
      fields: [
        defineField({
          name: 'title',
          description: 'Used for heading on the about section',
          title: 'Text',
          type: 'array' as const,
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
      type: 'array' as const,
      name: 'collection',
      title: 'Writings',
      description: 'This field is for all your writings',
      of: [
        defineArrayMember({
          type: 'object' as const,
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
              description: 'Not currently shown on the site (writing renders as text rows). Kept so it can be reinstated.',
            }),
            defineField({
              type: 'text',
              name: 'heading',
              title: 'Heading',
              description: 'Post title, shown on the row.',
            }),
            defineField({
              type: 'text',
              name: 'body',
              title: 'Body',
              description: 'One- or two-sentence summary. Shown on the row when no published date is set.',
            }),
            defineField({
              type: 'url',
              name: 'link',
              title: 'URL',
              description: 'Link to the full post.',
            }),
            defineField({
              // `date`, not `datetime`: a publication day has no time or zone,
              // and datetime invites an off-by-one when rendered.
              type: 'date',
              name: 'publishedAt',
              title: 'Published',
              description:
                'Optional. When set, the row shows this date instead of the summary, and it is added to the structured data.',
              options: {dateFormat: 'MMM D, YYYY'},
            }),
          ],
        }),
      ],
    }),
  ],
})
