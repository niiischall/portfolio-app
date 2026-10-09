export const navigationQuery = `*[_type == "navigation"][0]{
  heading,
  collection[]{
    _key,
    title,
    slug
  }
}`;

export const heroQuery = `*[_type == "hero"][0]{
  socials[]{
    _key,
    cover,
    url,
    caption,
    alt
  },
  greeting{
    link,
    text
  },
  cover{
    asset
  }
}`;

export const aboutQuery = `*[_type == "about"][0]{
  heading,
  overview,
  cv
}`;

export const workQuery = `*[_type == "work"][0]{
  heading,
  collection[] {
    _key,
    title,
    designation,
    meta,
    link,
    duration,
    description,
    cover
  }
}`;

export const writingsQuery = `*[_type == "writings"][0]{
  heading,
  // coalesce: GROQ returns null (not []) for an empty array field.
  "collection": coalesce(collection[]{
    _key,
    image,
    heading,
    body,
    link,
    publishedAt
  }, [])
}`;

export const footerQuery = `*[_type == "footer"][0]{
  heading,
  email,
  copyright,
  socials,
  collection,
}`;

// Raw GROQ. Consumers are responsible for encoding (the API route uses
// URLSearchParams, which encodes correctly). Never interpolate user input here.
export const combinedQuery = `{
    "navigation": ${navigationQuery},
    "hero": ${heroQuery},
    "about": ${aboutQuery},
    "work": ${workQuery},
    "writings": ${writingsQuery},
    "footer": ${footerQuery}
  }`;
