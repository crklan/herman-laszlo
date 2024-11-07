import {z} from 'zod'

export const serieZ = z.object({
  _id: z.string(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  slug: z.string().nullable(),
  cover: z.any().nullable(),
  paintings: z.any().nullable(),
})

export type Serie = z.infer<typeof serieZ>

export const seriesZ = z.array(serieZ)
