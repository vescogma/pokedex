import React, { useReducer } from 'react'

const reducer = (state, action) => {
  switch (action.type) {
    case 'pokemon':
    default:
      return state
  }
}

export const Store = React.createContext({})

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer)
  return <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
}
