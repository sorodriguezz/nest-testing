import { PaginationDto } from './../shared/dtos/pagination.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PokeapiResponse } from './interfaces/pokeapi.response';
import { Pokemon } from './entities/pokemon.entity';
import { PokemonapiPokemonResponse } from './interfaces/pokeapi-pokemon.response';

@Injectable()
export class PokemonsService {
  paginatedPokemonCache = new Map<string, Pokemon[]>();

  create(createPokemonDto: CreatePokemonDto) {
    return Promise.resolve(`This actions adds a ${createPokemonDto.name}`);
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

  findOne(id: number) {
    return this.getPokemonInformation(id);
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return Promise.resolve(`This action updates a #${id} pokemon`);
  }

  remove(id: number) {
    return Promise.resolve(`This action removes a #${id} pokemon`);
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
