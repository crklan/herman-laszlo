import {z} from 'zod'
export const paintingZ = z.object({
  _id: z.string(),
  title: z.string().nullable(),
  slug: z.string().nullable(),
  technique: z.string().nullable(),
  series: z.string().nullable(),
  height: z.number().nullable(),
  width: z.number().nullable(),
  year: z.number().nullable(),
  description: z.string().nullable(),
  image: z.any().nullable(),
  featured: z.boolean().nullable(),
  sold: z.boolean().nullable(),
  location: z.string().nullable(),
})

export type Painting = z.infer<typeof paintingZ>

export const paintingsZ = z.array(paintingZ)
