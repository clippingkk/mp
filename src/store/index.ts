import { createStore, applyMiddleware, compose } from 'redux'
// import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers'

const composeEnhancers =
  typeof window === 'object' &&
  (window as any)['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] ?
    (window as any)['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']({
    }) : compose

const middlewares: any[] = [
  // thunkMiddleware
]

if (process.env.NODE_ENV === 'development') {
  // middlewares.push(require('redux-logger').createLogger())
}

const enhancer = composeEnhancers(
  applyMiddleware(...middlewares),
)

export default function configStore() {
  const store = createStore(rootReducer, enhancer)
  return store
}
