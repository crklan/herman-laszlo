import groq from 'groq'

export const HOME_QUERY = groq`*[_id == "home"][0]{ title, siteTitle }`

export const RECORDS_QUERY = groq`*[_type == "record"][0...12]|order(title asc){
    _id,
    _type,
    title,
    releaseDate,
    "slug": slug.current,
    "artist": artist->name,
    image
  } | order(releaseDate desc)`

export const RECORD_QUERY = groq`*[_type == "record" && slug.current == $slug][0]{
  ...,
  _id,
  title,
  releaseDate,
  // GROQ can re-shape data in the request!
  "slug": slug.current,
  "artist": artist->name,
  // coalesce() returns the first value that is not null
  // so we can ensure we have at least a zero
  "likes": coalesce(likes, 0),
  "dislikes": coalesce(dislikes, 0),
  // for simplicity in this demo these are typed as "any"
  // we can make them type-safe with a little more work
  // https://www.simeongriggs.dev/type-safe-groq-queries-for-sanity-data-with-zod
  image,
  content,
  // this is how we extract values from arrays
  tracks[]{
    _key,
    title,
    duration
  }
}`

export const PAINTING_QUERY = groq`*[_type == "painting" && _id == $id][0]{
  ...,
  id_,
  _createdAt,
  _updatedAt,
  title,
  "series": series->name,
  "technique": techniques->name
}`

export const PAINTINGS_QUERY = groq`*[_type == "painting"][0...9]{
  ...,
  id_,
  _createdAt,
  _updatedAt,
  title,
  "series": series->name,
  "techniques": techniques->name
}
| order(_title asc)`

export const SERIES_QUERY = groq`*[_type == "series"]{
  ...,
  id_,
  _createdAt,
  _updatedAt,
  name,
  "slug": slug.current,
  "cover": *[ _type == "painting" && references(^._id) && featured == true ][0]{image}
}`

/*export const SERIE_QUERY = groq`*[_type == "series" && _id == $id][0]{
  ...,
  id_,
  _createdAt,
  _updatedAt,
  name,
  "slug": slug.current,
  "paintings": *[ _type == "painting" && references(^._id)  ]{...}
}`*/

export const TECHNIQUES_QUERY = groq`*[_type == "technique"]{
  ...,
  id_,
  _createdAt,
  _updatedAt,
  name,
  "slug": slug.current,
  "cover": *[ _type == "painting" && references(^._id) ][0]{image}
}`

/*export const TEHNIQUE_QUERY = groq`*[_type == "technique" && _id == $id][0]{
  ...,
  id_,
  _createdAt,
  _updatedAt,
  name,
  "slug": slug.current,
  "paintings": *[ _type == "painting" && references(^._id)  ]{...}
}`*/

export const PAGINATED_SERIES_PAINTINGS_QUERY = groq`*[_type == "series" && _id == $seriesId][0] {
  "paintings": *[_type == "painting" && references(^._id)] | order(_createdAt desc) [$offset...$offset + $limit] {
    _id,
    title,
    image,
    technique,
    width,
    height,
    year,
    "series": series->name
  }
}`

// Paginated technique paintings query (based on TEHNIQUE_QUERY)
export const PAGINATED_TECHNIQUE_PAINTINGS_QUERY = groq`*[_type == "technique" && _id == $techniqueId][0] {
  "paintings": *[_type == "painting" && references(^._id)] | order(_createdAt desc) [$offset...$offset + $limit] {
    _id,
    title,
    image,
    technique,
    width,
    height,
    year,
    "series": series->name
  }
}`

// Keep the existing SERIE_QUERY and TEHNIQUE_QUERY for initial loads
export const SERIE_QUERY = `*[_type == "series" && _id == $id][0] {
  _id,
  name,
  description,
  cover,
  "paintings": *[_type == "painting" && references(^._id)] | order(_createdAt desc) [0...20] {
    _id,
    title,
    image,
    technique,
    width,
    height,
    year,
    "series": series->name
  },
  "totalCount": count(*[_type == "painting" && references(^._id)])
}`

// Update TEHNIQUE_QUERY to also include totalCount
export const TEHNIQUE_QUERY = groq`*[_type == "technique" && _id == $id][0] {
  _id,
  name,
  description,
  "slug": slug.current,
  "paintings": *[_type == "painting" && references(^._id)] | order(_createdAt desc) [0...20] {
    _id,
    title,
    image,
    technique,
    width,
    height,
    year,
    "series": series->name
  },
  "totalCount": count(*[_type == "painting" && references(^._id)])
}`
