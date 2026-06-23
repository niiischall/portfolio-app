import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  type: 'document',
  name: 'hero',
  title: 'Hero',
  fields: [
    defineField({
      type: 'string',
      name: 'title',
      title: 'Title',
      description: 'This field is the title of your hero section.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: 'array',
      name: 'socials',
      title: 'Socials',
      description: 'This field is the socials for your hero section.',
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
      type: 'object',
      name: 'greeting',
      title: 'Greeting',
      description: 'This field is the greetings component for your hero section.',
      fields: [
        defineField({
          name: 'text',
          description: 'Used for introduction on the hero section',
          title: 'Text',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [
                {title: 'Normal', value: 'normal'},
                {title: 'H1', value: 'h1'},
                {title: 'H2', value: 'h2'},
                {title: 'H3', value: 'h3'},
              ],
              marks: {
                decorators: [
                  {title: 'Strong', value: 'strong'},
                  {title: 'Emphasis', value: 'em'},
                ],
              },
            },
          ],
          validation: (rule) => rule.max(250).required(),
        }),
        defineField({
          type: 'object',
          name: 'link',
          title: 'Link',
          fields: [
            defineField({
              type: 'string',
              name: 'text',
              title: 'Text',
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
    defineField({
      type: 'image',
      name: 'cover',
      title: 'Cover',
      options: {
        hotspot: true,
      },
      description:
        'This image will be used as the cover image for the site. This is the image displayed in the hero section within the portfolio.',
      validation: (rule) => rule.required(),
    }),
  ],
})
