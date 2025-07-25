import { PaginationDto } from './../shared/dtos/pagination.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PokeapiResponse } from './interfaces/pokeapi.response';
import { Pokemon } from './entities/pokemon.entity';
import { PokemonapiPokemonResponse } from './interfaces/pokeapi-pokemon.response';

@Injectable()
export class PokemonsService {
  paginatedPokemonCache = new Map<string, Pokemon[]>();
  pokemonsCache = new Map<number, Pokemon>();

  async create(createPokemonDto: CreatePokemonDto) {
    const pokemon: Pokemon = {
      ...createPokemonDto,
      id: Math.floor(Math.random() * 10000),
      hp: createPokemonDto.hp || 0,
      sprites: createPokemonDto.sprites || [],
    };

    this.pokemonsCache.forEach((storedPokemon) => {
      if (pokemon.name === storedPokemon.name) {
        throw new BadRequestException(
          `Pokemon with name ${createPokemonDto.name} already exists`,
        );
      }
    });

    this.pokemonsCache.set(pokemon.id, pokemon);

    return Promise.resolve(pokemon);
  }

  async findAll(paginationDto: PaginationDto): Promise<Pokemon[]> {
    const { limit = 10, page = 1 } = paginationDto;
    const offset = (page - 1) * limit;

    const cacheKey = `${limit}-${page}`;

    if (this.paginatedPokemonCache.has(cacheKey)) {
      return this.paginatedPokemonCache.get(cacheKey)!;
    }

    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

    const response = await fetch(url);
    const data = (await response.json()) as PokeapiResponse;

    const pokemonPromises = data.results.map(async (pokemon) => {
      const url = pokemon.url;
      const id = url.split('/').at(-2);
      const pokemonId = Number(id);

      return this.getPokemonInformation(pokemonId);
    });

    const pokemonData = await Promise.all(pokemonPromises);

    this.paginatedPokemonCache.set(cacheKey, pokemonData);

    return pokemonData;
  }

  async findOne(id: number) {
    if (this.pokemonsCache.has(id)) {
      return this.pokemonsCache.get(id)!;
    }
    const pokemon = await this.getPokemonInformation(id);
    this.pokemonsCache.set(pokemon.id, pokemon);
    return pokemon;
  }

  async update(id: number, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = this.pokemonsCache.get(id);
    if (!pokemon) {
      throw new NotFoundException(`Pokemon with id ${id} not found`);
    }
    const updatedPokemon: Pokemon = {
      ...pokemon,
      ...updatePokemonDto,
    };
    this.pokemonsCache.set(id, updatedPokemon);
    return Promise.resolve(updatedPokemon);
  }

  async remove(id: number) {
    const pokemon = this.pokemonsCache.get(id);

    this.pokemonsCache.delete(id);

    return Promise.resolve(`Pokemon ${pokemon?.name} removed!`);
  }

  private async getPokemonInformation(id: number): Promise<Pokemon> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

    if (response.status === 404) {
      throw new NotFoundException(`Pokemon with id ${id} not found`);
    }

    const data = (await response.json()) as PokemonapiPokemonResponse;

    return {
      id: data.id,
      name: data.name,
      type: data.types[0].type.name,
      hp: data.stats[0].base_stat,
      sprites: [data.sprites.front_default, data.sprites.back_default],
    };
  }
}
