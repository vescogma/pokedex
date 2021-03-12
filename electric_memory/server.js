const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const cors = require('cors')
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLEnumType,
} = require('graphql')
const POKEDEX = require('pokemon.json/pokedex.json')
const TYPES = require('pokemon.json/types.json')
const TYPES_ENGLISH_MAP = TYPES.reduce(
  (acc, type) => ({ ...acc, [type.english]: type }),
  {},
)
const POKEDEX_MAP = POKEDEX.reduce(
  (acc, entry) => ({ ...acc, [entry.id]: entry }),
  {},
)

/** schema */

const typeEnum = new GraphQLEnumType({
  name: 'Type',
  values: TYPES.reduce((acc, type) => ({ ...acc, [type.english]: {} }), {}),
})

const languageEnum = new GraphQLEnumType({
  name: 'Language',
  values: { english: {}, japanese: {}, chinese: {}, french: {} },
})

const baseType = new GraphQLObjectType({
  name: 'Base',
  fields: {
    hp: { type: GraphQLInt },
    attack: { type: GraphQLInt },
    defense: { type: GraphQLInt },
    sp_attack: { type: GraphQLInt },
    sp_defense: { type: GraphQLInt },
    speed: { type: GraphQLInt },
  },
})

const pokemonType = new GraphQLObjectType({
  name: 'Pokemon',
  fields: {
    poke_id: { type: GraphQLInt },
    name: { type: GraphQLString },
    type: { type: new GraphQLList(GraphQLString) },
    base: { type: baseType },
  },
})

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      types: {
        type: new GraphQLList(typeEnum),
        resolve: () => TYPES.map(type => type.english),
      },
      pokemon: {
        type: pokemonType,
        args: {
          poke_id: { type: GraphQLInt },
          lang: { type: languageEnum },
        },
        resolve: (_, { poke_id, lang }) =>
          transformPokemon(POKEDEX_MAP[poke_id], lang),
      },
      pokemons: {
        type: new GraphQLList(pokemonType),
        args: {
          limit: { type: GraphQLInt },
          page: { type: GraphQLInt },
          type: { type: typeEnum },
          lang: { type: languageEnum },
        },
        resolve: (_, { limit, page, type, lang }) =>
          filterPokemon(limit, page, type, lang),
      },
    },
  }),
})

/** run */

const app = express()

app.use(cors())
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  }),
)

app.listen(4000)

console.log('Explore the api at http://localhost:4000/graphql')

/*
example pokemon and pokemon list queries

http://localhost:4000/graphql?query=query%20pokemon%20%7B%0A%20%20pokemon(poke_id%3A%201%2C%20lang%3A%20english)%20%7B%0A%20%20%20%20poke_id%0A%20%20%20%20name%0A%20%20%20%20base%20%7B%0A%20%20%20%20%20%20hp%0A%20%20%20%20%20%20attack%0A%20%20%20%20%20%20defense%0A%20%20%20%20%20%20sp_attack%0A%20%20%20%20%20%20sp_defense%0A%20%20%20%20%20%20speed%0A%20%20%20%20%7D%0A%20%20%20%20type%0A%20%20%7D%0A%7D%0A%0Aquery%20listPokemon%20%7B%0A%20%20pokemons(limit%3A%205%2C%20page%3A%204%2C%20type%3A%20Fire)%20%7B%0A%20%20%20%20poke_id%0A%20%20%20%20name%0A%20%20%7D%0A%7D%0A&operationName=pokemon
*/

/** utils */

const transformPokemon = (pokemon, language = 'english') => {
  const poke_id = pokemon.id
  const name = pokemon.name[language] || pokemon.name.english
  const type =
    language === 'english'
      ? pokemon.type
      : pokemon.type.map(key => TYPES_ENGLISH_MAP[key][language] || key)
  const base = {
    hp: pokemon.base.HP,
    attack: pokemon.base.Attack,
    defense: pokemon.base.Defense,
    sp_attack: pokemon.base['Sp. Attack'],
    sp_defense: pokemon.base['Sp. Defense'],
    speed: pokemon.base.Speed,
  }
  return { poke_id, name, type, base }
}

const filterPokemon = (limit = 10, page = 0, type, language = 'english') => {
  if (!POKEDEX[page * limit]) {
    return []
  }
  return POKEDEX.filter(pokemon => (!type ? true : pokemon.type.includes(type)))
    .slice(page * limit, page * limit + limit)
    .map(pokemon => transformPokemon(pokemon, language))
}
