import React from 'react'
import Taro from '@tarojs/taro'
import { API_HOST } from '../constants/config'
import { token } from '../store/global';
import { ApolloLink, HttpLink, ApolloClient, InMemoryCache } from '@apollo/client';
import { onError } from "@apollo/client/link/error"

export interface IBaseResponseData {
  status: Number
  msg: string
  data: any
}

export async function request<T>(url: string, options: any = {}): Promise<T> {
  if (token) {
    options.header = {
      'Authorization': `Bearer ${token}`,
    }
  }

  if (!url.startsWith('http')) {
    url = API_HOST + url
  }
  try {
    const response: IBaseResponseData = await Taro.request({
      url,
      ...(options as any)
    }).then(res => res.data)
    console.log(response)
    return response as any
    // if (response.status >= 400) {
    //   throw new Error(response.msg)
    // }
    // return response.data as T
  } catch (e) {
    console.log(e)
    return Promise.reject(e)
  }
}

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => {
    if (!token) {
      return headers
    }

    return {
      headers: {
        ...headers,
        'Authorization': `Bearer ${token}`
      }
    }
  })

  return forward(operation)
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    Taro.showToast({
      icon: 'none',
      title: graphQLErrors[0].message,
    })
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});
export default function apolloFetcher(url, { body, method, headers }) {
  return new Promise(resolve =>
    Taro.request({
      url,
      header: headers,
      method,
      data: body,
      dataType: "text",
      complete: ({ data, statusCode, errMsg }: any) =>
        resolve({
          ok: () => statusCode >= 200 && statusCode < 300,
          statusText: () => errMsg,
          text: () => Promise.resolve(data),
        }),
    })
  );
}

const httpLink = new HttpLink({
  uri: API_HOST + '/v2/graphql',
  fetch: apolloFetcher as any
})

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: errorLink.concat(authLink.concat(httpLink)),
})
