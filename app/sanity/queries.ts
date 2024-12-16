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

export const SERIE_QUERY = groq`*[_type == "series" && _id == $id][0]{
  ...,
  id_,
  _createdAt,
  _updatedAt,
  name,
  "slug": slug.current,
  "paintings": *[ _type == "painting" && references(^._id)  ]{...}
}`

export const TECHNIQUES_QUERY = groq`*[_type == "technique"]{
  ...,
  id_,
  _createdAt,
  _updatedAt,
  name,
  "slug": slug.current,
  "cover": *[ _type == "painting" && references(^._id) ][0]{image}
}`

export const TEHNIQUE_QUERY = groq`*[_type == "technique" && _id == $id][0]{
  ...,
  id_,
  _createdAt,
  _updatedAt,
  name,
  "slug": slug.current,
  "paintings": *[ _type == "painting" && references(^._id)  ]{...}
}`
