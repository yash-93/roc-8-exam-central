import { useMemo } from 'react';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';

let apolloClient: any = null;

function createApolloClient() {

  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    //@ts-ignore
    link: createUploadLink({
      // uri: "http://localhost:3000/api/graphql/",
      uri: `${process.env.GRAPHQL_URL}`,
      credentials: 'include'
    }),
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();
  if (initialState) {
    const existingCache = _apolloClient.extract();
    //@ts-ignore
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }
  if (typeof window === "undefined") return _apolloClient;
  if (!apolloClient) apolloClient = _apolloClient;
  return _apolloClient;
}
//@ts-ignore
export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
