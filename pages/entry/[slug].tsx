import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from 'next'
import flatMap from 'lodash/flatMap'
import { getPlant, getPlantList, getCategoryList } from '@api'
import Link from 'next/link'

import { Layout } from '@components/Layout'
import { Typography } from '@ui/Typography'
import { Grid } from '@ui/Grid'

import { RichText } from '@components/RichText'
import { AuthorCard } from '@components/AuthorCard'
import { PlantEntryInline } from '@components/PlantCollection'

// 2. Que paginas se renderizan
type PathType = {
  params: {
    slug: string
  }
  locale: string
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  if (locales === undefined) {
    throw new Error(
      'Uh, did you forget to configure locales in your next.config file'
    )
  }
  const entries = await getPlantList({ limit: 10 })

  const paths: PathType[] = flatMap(
    entries.map(({ slug }) => ({
      params: { slug },
    })),
    (path) => locales.map((loc) => ({ locale: loc, ...path }))
  )

  return {
    paths,
    // 404 en las entradas no encontradas
    fallback: 'blocking',
  }
}

// 1. Como alimentar la pagina
type PlantsEntryProps = {
  plant: Plant
  otherEntries: Plant[]
  categories: Category[]
}

export const getStaticProps: GetStaticProps<PlantsEntryProps> = async ({
  params,
  preview,
  locale,
}) => {
  const slug = params?.slug

  if (typeof slug !== 'string') {
    return {
      notFound: true,
    }
  }

  try {
    const plant = await getPlant(slug, preview, locale)
    const otherEntries = await getPlantList({ limit: 5 })
    const categories = await getCategoryList({ limit: 10 })

    return {
      props: {
        plant,
        otherEntries,
        categories,
      },
      revalidate: 5 * 60, //refresh 5min
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}

export default function PlantEntryPage({
  plant,
  otherEntries,
  categories,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8} lg={9} component="article">
          <figure>
            <img width={952} src={plant.image.url} alt={plant.image.title} />
          </figure>
          <div className="px-12 pt-8">
            <Typography variant="h2">{plant.plantName}</Typography>
          </div>
          <div className="p-10">
            <RichText richText={plant.description} />
          </div>
        </Grid>
        <Grid item xs={12} md={4} lg={3} component="aside">
          <section>
            <Typography variant="h5" component="h3" className="mb-4">
              Recent posts
            </Typography>
            {otherEntries.map((plantEntry) => (
              <article className="mb-4" key={plantEntry.id}>
                <PlantEntryInline {...plantEntry} />
              </article>
            ))}
          </section>
          <section className="mt-10">
            <Typography variant="h5" component="h3" className="mb-4">
              Categories
            </Typography>
            <ul className="list">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link passHref href={`/category/${category.slug}`}>
                    <Typography component="a" variant="h6">
                      {category.title}
                    </Typography>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </Grid>
      </Grid>
      <section className="my-4 border-t-2 border-b-2 border-gray-200 pt-12 pb-7">
        <AuthorCard {...plant.author} />
      </section>
    </Layout>
  )
}
