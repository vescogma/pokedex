import React from 'react'
import { usePreloadedQuery } from 'react-relay/hooks'
import { Box, Heading, Text } from 'rebass'

const List = ({ query, queryRef }) => {
  const { pokemons } = usePreloadedQuery(query, queryRef)

  return (
    <Box
      as="ul"
      style={{ listStyleType: 'none' }}
      p={0}
      sx={{
        display: 'grid',
        gridGap: 4,
        gridTemplateColumns: ['1fr 1fr', '1fr 1fr 1fr', '1fr 1fr 1fr 1fr'],
      }}
    >
      {pokemons.map(pokemon => (
        <Box
          as="li"
          key={pokemon.poke_id}
          p={2}
          style={{
            borderTopLeftRadius: '1rem',
            borderTopRightRadius: '12rem',
            borderBottomLeftRadius: '1rem',
            borderBottomRightRadius: '1rem',
          }}
          bg="hsla(243, 75%, 95%, 50%)"
        >
          <Heading fontSize={4} mb={2}>
            {pokemon.name}
          </Heading>
          <Box
            mb={1}
            sx={{
              display: 'grid',
              gridGap: 1,
              gridTemplateColumns: '1fr 1fr',
            }}
          >
            <Text fontSize={1} fontWeight="bold">
              HP
            </Text>
            <Text fontSize={1} textAlign="right">
              {pokemon.base.hp}
            </Text>
            <Text fontSize={1} fontWeight="bold">
              Attack
            </Text>
            <Text fontSize={1} textAlign="right">
              {pokemon.base.attack}
            </Text>
            <Text fontSize={1} fontWeight="bold">
              Defense
            </Text>
            <Text fontSize={1} textAlign="right">
              {pokemon.base.defense}
            </Text>
            <Text fontSize={1} fontWeight="bold">
              Sp. Attack
            </Text>
            <Text fontSize={1} textAlign="right">
              {pokemon.base.sp_attack}
            </Text>
            <Text fontSize={1} fontWeight="bold">
              Sp. Defense
            </Text>
            <Text fontSize={1} textAlign="right">
              {pokemon.base.sp_defense}
            </Text>
            <Text fontSize={1} fontWeight="bold">
              Speed
            </Text>
            <Text fontSize={1} textAlign="right">
              {pokemon.base.speed}
            </Text>
            <Text fontSize={1} fontWeight="bold">
              Types
            </Text>
            <Box>
              {pokemon.type.map(type => (
                <Text key={type} fontSize={1} textAlign="right">
                  {type}
                </Text>
              ))}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default List
