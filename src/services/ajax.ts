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
    if (response.status !== 200) {
      throw new Error(response.msg)
    }
    return response.data as T
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

const httpLink = new HttpLink({
  uri: API_HOST + '/v2/graphql',
  //   fetch: (url, options: any ) => {
  //     const { method = "POST", header, body } = options
  //     return request(url, body, {
  //       method,
  //       herder
  //     }).then(res => {
  //       const { data, statusCode } = res;
  //       res.text = () => Promise.resolve(JSON.stringify(data));
  //       return res;
  //     });
  //   }
  // }
  fetch: (url: string, options: any) => request(url, { ...options, data: options.body })
})

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: errorLink.concat(authLink.concat(httpLink)),
})
