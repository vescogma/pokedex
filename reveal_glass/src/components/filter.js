import React from 'react'
import graphql from 'babel-plugin-relay/macro'
import { loadQuery, usePreloadedQuery } from 'react-relay/hooks'
import { Box } from 'rebass'
import { Select } from '@rebass/forms'
import { environment } from '../utils/relay-environment'

const typesQuery = graphql`
  query filterTypesQuery {
    types
  }
`

const preload = loadQuery(environment, typesQuery, {})

const TypeOptions = () => {
  const { types } = usePreloadedQuery(typesQuery, preload)

  return types.map(name => (
    <option key={name} label={name} value={name}>
      {name}
    </option>
  ))
}

const Filter = ({ onSelect }) => (
  <Box>
    <Select
      id="type"
      name="type"
      onChange={({ target }) => onSelect(target.value)}
    >
      <option key="All" label="All" value="">
        All
      </option>
      <React.Suspense fallback={null}>
        <TypeOptions />
      </React.Suspense>
    </Select>
  </Box>
)

export default Filter
