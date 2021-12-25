import { useQuery, QueryFunction, UseQueryOptions } from 'react-query'
import {
  IGetAuthorListQuery,
  IGetAuthorListQueryVariables,
} from '../generated/graphql'

import { sdk } from '../index'
import { selectAuthors } from '../selectors'

type GetAuthorsArgs = IGetAuthorListQueryVariables

type QueryKey = ['authors', GetAuthorsArgs]

const fetchAuthorsList: QueryFunction<IGetAuthorListQuery, QueryKey> = ({
  queryKey,
}) => {
  const [_key, args] = queryKey
  return sdk.getAuthorList(args)
}

type Options = Pick<
  UseQueryOptions,
  'enabled' | 'staleTime' | 'refetchOnWindowFocus' | 'refetchOnMount'
>

export function useAuthors(args: GetAuthorsArgs, options?: Options) {
  return useQuery(['authors', args], fetchAuthorsList, {
    ...options,
    select: (data) => selectAuthors(data.authorCollection),
  })
}
