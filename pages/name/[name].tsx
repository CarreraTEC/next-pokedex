import { useState } from 'react';
import { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import { Button, Card, Container, Grid, Image, Text } from '@nextui-org/react';
import { pokeApi } from '../../api';
import { Layout } from "../../components/layouts"
import { Pokemon } from '../../interfaces';
import { getPokemonInfo, localFavorites } from '../../utils';
import confetti from 'canvas-confetti';
import { PokemonListResponse } from '../../interfaces/pokemon-list';

interface Props {
  pokemon: Pokemon;
}

const PokemonByNamePage: NextPage<Props> = ({ pokemon }) => {

  const [isInFavorites, setIsInFavorites] = useState(localFavorites.existInFavorites(pokemon.id));

  const onToggleFavorite = () => {
    localFavorites.toggleFavorite(pokemon.id);
    setIsInFavorites(!isInFavorites);
    
    if(!isInFavorites) {
      confetti({
        zIndex: 999,
        particleCount: 100,
        spread: 160,
        angle: -100,
        origin: {
          x: 1,
          y: 0
        }
      })
    }
  }

  return (
    <Layout title={pokemon.name}>
      <Grid.Container css={{ marginTop: '5px '}} gap={2}>
        <Grid xs={12} sm={4}>
          <Card hoverable css={{ padding: '30px' }}>
            <Card.Body>
              <Card.Image 
                src={ pokemon.sprites.other?.dream_world.front_default || '/no-image.png'}
                alt={ pokemon.name }
                width="100%"
                height={200}
              />
            </Card.Body>
          </Card>
        </Grid>
        <Grid xs={12} sm={8}>
          <Card>
            <Card.Header css={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
              <Text h1 transform="capitalize">{ pokemon.name }</Text>
              <Button
                color="gradient"
                ghost={!isInFavorites}
                shadow
                onClick={onToggleFavorite}
              >
                { isInFavorites ? 'Eliminar de favoritos' : 'Guardar en favoritos'}
              </Button>
            </Card.Header>
            <Card.Body>
              <Text size={30}>Sprites:</Text>
              <Container direction="row" display="flex" gap={0}>
                <Image 
                  src={ pokemon.sprites.front_default }
                  alt={ pokemon.name }
                  width={100}
                  height={100}
                />
                <Image 
                  src={ pokemon.sprites.back_default }
                  alt={ pokemon.name }
                  width={100}
                  height={100}
                />
                <Image 
                  src={ pokemon.sprites.front_shiny }
                  alt={ pokemon.name }
                  width={100}
                  height={100}
                />
                <Image 
                  src={ pokemon.sprites.back_shiny }
                  alt={ pokemon.name }
                  width={100}
                  height={100}
                />
              </Container>
            </Card.Body>
          </Card>
        </Grid>
      </Grid.Container>
    </Layout>
  )
}

// Esta función solo se ejecuta al hacer el build o al refrescar en desarrollo
export const getStaticPaths: GetStaticPaths = async (ctx) => {

  const { data } = await pokeApi.get<PokemonListResponse>('/pokemon?limit=151');
  const pokemonNames: string[] = data.results.map(pokemon => pokemon.name);

  return {
    paths: pokemonNames.map(name => ({
      params: { name }
    })),
    fallback: false //Si la página no existe, 404
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {

  const { name } = params as { name: string };

  return {
    props: {
      pokemon: await getPokemonInfo(name)
    }
  }
}

export default PokemonByNamePage