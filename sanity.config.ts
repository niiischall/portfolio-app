import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './src/sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'Portfolio',

  projectId: import.meta.env.VITE_PROJECT_ID,
  dataset: import.meta.env.VITE_DATASET,
  basePath: '/studio',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
