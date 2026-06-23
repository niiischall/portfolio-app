import {defineField} from 'sanity'

import {Input} from './components/input'

export default defineField({
  type: 'object',
  name: 'duration',
  title: 'Duration',
  components: {
    input: Input,
  },
  fields: [
    defineField({
      type: 'datetime',
      name: 'start',
      title: 'Start',
    }),
    defineField({
      type: 'datetime',
      name: 'end',
      title: 'End',
    }),
  ],
})
