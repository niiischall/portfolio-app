import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  type: 'document',
  name: 'footer',
  title: 'Footer',
  fields: [
    defineField({
      type: 'string',
      name: 'title',
      title: 'Title',
      description: 'This field is the title of the footer.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: 'object',
      name: 'heading',
      title: 'Heading',
      description: 'The heading for footer section.',
      fields: [
        defineField({
          name: 'title',
          description: 'Used for heading on the footer section',
          title: 'Text',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [{title: 'H3', value: 'h3'}],
              marks: {
                decorators: [{title: 'Strong', value: 'strong'}],
              },
            },
          ],
          validation: (rule) => rule.max(50).required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Used for email on the footer',
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright',
      type: 'string',
      description: 'Used for copyright on the footer',
    }),
    defineField({
      type: 'array',
      name: 'socials',
      title: 'Socials',
      description: 'This field is the socials for your footersection.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'social',
          title: 'Social',
          fields: [
            defineField({
              type: 'image',
              name: 'cover',
              title: 'Cover',
              options: {
                hotspot: true,
              },
              description:
                'This image will be used as the logo. This is the image displayed in the hero section within the social link.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              type: 'string',
              name: 'title',
              title: 'Title',
              description: 'This field is the title of your social.',
            }),
            defineField({
              type: 'url',
              name: 'url',
              title: 'URL',
              description: 'This field is the link of your social.',
            }),
            defineField({
              type: 'string',
              name: 'caption',
              title: 'Caption',
              description: 'This field is the caption of your social.',
            }),
            defineField({
              type: 'string',
              name: 'alt',
              title: 'Alt',
              description: 'Alternative text for screenreaders. Falls back on caption if not set',
            }),
          ],
        }),
      ],
    }),
    defineField({
      type: 'array',
      name: 'collection',
      title: 'Navigation Items List',
      description: 'Section links displayed on the footer.',
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
