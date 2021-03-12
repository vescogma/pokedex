import { Environment, Network, RecordSource, Store } from 'relay-runtime'
import { gqlFetch } from './relay-query'

const fetchRelay = async (params, variables)  => {
  console.log(`fetching query ${params.name} with ${JSON.stringify(variables)}`)
  return gqlFetch(params.text, variables)
}

export const environment = new Environment({
  network: Network.create(fetchRelay),
  store: new Store(new RecordSource()),
})
