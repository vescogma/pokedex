import React from 'react'
import { ThemeProvider } from '@emotion/react'
import graphql from 'babel-plugin-relay/macro'
import theme from '@rebass/preset'
import { StoreProvider } from './utils/store'
import { useQueryLoader } from 'react-relay/hooks'
import { Box, Button, Flex, Heading } from 'rebass'
import Filter from './components/filter'
import List from './components/list'
import './index.css'

const query = graphql`
  query AppPokemonsQuery($type: Type, $page: Int) {
    pokemons(type: $type, page: $page) {
      poke_id
      name
      base {
        hp
        attack
        defense
        sp_attack
        sp_defense
        speed
      }
      type
    }
  }
`

const App = () => {
  const [queryRef, loadQuery] = useQueryLoader(query)
  const [page, setPage] = React.useState(0)
  const [type, setType] = React.useState(null)

  React.useEffect(() => {
    loadQuery({})
  }, [loadQuery])

  return (
    <StoreProvider>
      <ThemeProvider theme={theme}>
        <Flex
          flexDirection="column"
          alignItems="center"
          width="100vw"
          height="100vh"
          p={4}
        >
          <Box as="header" mb={4}>
            <Heading fontSize={6}>PIKA-DEX</Heading>
          </Box>
          <Box as="section" width="100%" maxWidth={'64rem'}>
            <Flex flexDirection="row" alignItems="center" mb={4}>
              <Button
                bg={page < 1 ? "hsl(1, 0%, 75%)" : "hsl(243, 75%, 95%)"}
                color={page < 1 ? 'grey' : 'black'}
                disabled={page < 1}
                onClick={() => {
                  const nextPage = Math.max(0, page - 1)
                  setPage(nextPage)
                  loadQuery({ type, page: nextPage })
                }}
              >
                &#10094;
              </Button>
              <Box flex={1} mx={4}>
                <Filter
                  onSelect={val => {
                    const nextType = !val ? null : val
                    setType(nextType)
                    loadQuery({ type: nextType, page: 0 })
                  }}
                />
              </Box>
              <Button
                bg="hsl(243, 75%, 95%)"
                color="black"
                onClick={() => {
                  const nextPage = page + 1
                  setPage(nextPage)
                  loadQuery({ type, page: nextPage })
                }}
              >
                &#10095;
              </Button>
            </Flex>
            <React.Suspense fallback={<Box>Loading...</Box>}>
              {queryRef !== null && <List query={query} queryRef={queryRef} />}
            </React.Suspense>
          </Box>
        </Flex>
      </ThemeProvider>
    </StoreProvider>
  )
}

export default App
