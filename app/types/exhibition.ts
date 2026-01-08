import {z} from 'zod'

export const exhibitionZ = z.object({
  _id: z.string(),
  _createdAt: z.string().optional(),
  _updatedAt: z.string().optional(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  slug: z.string().nullable(),
  startDate: z.string(),
  endDate: z.string(),
  location: z.string(),
  coverImage: z.any().nullable(),
  exhibitionPhotos: z.array(z.any()).nullable().optional(),
  videoUrl: z.string().url().nullable().optional(),
  relatedSeries: z
    .array(
      z.object({
        _id: z.string(),
        name: z.string().nullable(),
        slug: z.string().nullable(),
      }),
    )
    .nullable()
    .optional(),
})

export type Exhibition = z.infer<typeof exhibitionZ>
