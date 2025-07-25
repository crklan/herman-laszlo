import {z} from 'zod'

export const techniqueZ = z.object({
  _id: z.string(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  slug: z.string().nullable(),
  cover: z.any().nullable(),
  paintings: z.any().nullable(),
  totalCount: z.number().nullable(),
})

export type Technique = z.infer<typeof techniqueZ>

export const TechniquesZ = z.array(techniqueZ)
