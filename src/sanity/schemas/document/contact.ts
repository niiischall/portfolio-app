import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  type: 'document',
  name: 'contact',
  title: 'Contact',
  liveEdit: false,
  fields: [
    defineField({
      type: 'string',
      name: 'title',
      title: 'Title',
      description: 'This field is the title of your contact section.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: 'object',
      name: 'heading',
      title: 'Heading',
      description: 'The heading for contact section.',
      fields: [
        defineField({
          name: 'title',
          description: 'Used for heading on the contact section',
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
      name: 'text',
      description: 'Used for body on the contact section',
      title: 'Text',
      type: 'array',
      of: [
        defineArrayMember({
          lists: [],
          marks: {
            decorators: [
              {
                title: 'Italic',
                value: 'em',
              },
              {
                title: 'Strong',
                value: 'strong',
              },
            ],
          },
          type: 'block',
        }),
      ],
      validation: (rule) => rule.max(250).required(),
    }),
    defineField({
      type: 'object',
      name: 'link',
      title: 'Link',
      description: 'This field is the link of your contact section.',
      fields: [
        defineField({
          type: 'text',
          name: 'text',
          title: 'Text',
          description: 'This field is the link text of your contact section.',
        }),
        defineField({
          type: 'url',
          name: 'href',
          title: 'Url',
          description: 'This field is the link url of your contact section.',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['http', 'https', 'mailto', 'tel'],
            }),
        }),
      ],
    }),
  ],
})
