import promiseFinally from 'promise.prototype.finally'
promiseFinally.shim()

import { ApolloProvider } from '@apollo/client';
import * as React from 'react';
import { Provider } from 'react-redux';
import './app.css';
import { client } from './services/ajax';
import configStore from './store';


const store = configStore()

function App(props: any) {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        {props.children}
      </Provider>
    </ApolloProvider>
  )
}

export default App;
