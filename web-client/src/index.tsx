import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import Store from './store/store'

interface IStore {
  store: Store
}

const store = new Store()

export const Context = React.createContext<IStore>({ store })

ReactDOM.render(
  <Context.Provider value={{ store }}>
    <App />
  </Context.Provider>,
  document.getElementById('root')
)