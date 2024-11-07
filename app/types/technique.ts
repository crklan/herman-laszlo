import {z} from 'zod'

export const techniqueZ = z.object({
  _id: z.string(),
  name: z.string().nullable(),
  slug: z.string().nullable(),
  cover: z.any().nullable(),
})

export type Technique = z.infer<typeof techniqueZ>

export const TechniquesZ = z.array(techniqueZ)
