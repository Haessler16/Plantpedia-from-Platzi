import React, {
  useState,
  ChangeEventHandler,
  useEffect,
  // useCallback,
} from 'react'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import get from 'lodash/get'
import flatMap from 'lodash/flatMap'
import clsx from 'clsx'

import {
  InputLabel,
  InputAdornment,
  FormControl,
  OutlinedInput,
} from '@ui/FormField'
import { SearchIcon } from '@ui/icon/Search'
import { Typography } from '@ui/Typography'

import { Layout } from 'components/Layout'
import { PlantCollection } from 'components/PlantCollection'

// import { searchPlants, QueryStatus } from 'api'
import { useInfinitePlantSearch } from '@api/query/useInfinitePlantSearch'
import { Button } from '@ui/Button'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return { props: await serverSideTranslations(locale!) }
}

const Search = () => {
  const { t } = useTranslation(['page-search'])
  const [term, setTerm] = useState('')

  const searchTerm = useDebounce(term, 500)

  const { data, status, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfinitePlantSearch(
      { term: searchTerm },
      { enabled: searchTerm.trim().length > 1, staleTime: Infinity }
    )

  const updateTerm: ChangeEventHandler<HTMLInputElement> = (event) =>
    setTerm(event.currentTarget.value)

  const emptyResults =
    status === 'success' && get(data, 'pages[0].length', 0) === 0

  let results: Plant[] = []
  if (data?.pages != null) {
    results = flatMap(data.pages)
  }

  return (
    <Layout>
      <main className="pt-16 text-center">
        <div className="max-w-5xl max-auto mb-6">
          <FormControl fullWidth className="" variant="outlined">
            <InputLabel htmlFor="search-term-field">{t('term')}</InputLabel>
            <OutlinedInput
              id="search-term-field"
              value={term}
              onChange={updateTerm}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
              labelWidth={100}
            />
          </FormControl>
        </div>
        <div>
          {emptyResults ? (
            <Typography variant="body1">{t('notFound', { term })}</Typography>
          ) : null}
        </div>
        <div>
          {!emptyResults ? (
            <PlantCollection plants={results} variant="square" />
          ) : null}
        </div>
      </main>
      {!hasNextPage ? null : (
        <div className="text-center p4">
          <Button
            variant="outlined"
            disabled={isFetchingNextPage}
            className={clsx({ 'animate-pulse': isFetchingNextPage })}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? t('loading') : t('loadMore')}
          </Button>
        </div>
      )}
    </Layout>
  )
}

function useDebounce<T>(term: T, wait = 0) {
  const [debouncedValue, setDebounceValue] = useState(term)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebounceValue(term)
    }, wait)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [term])

  return debouncedValue
}

export default Search
