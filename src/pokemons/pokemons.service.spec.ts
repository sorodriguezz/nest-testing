import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsService } from './pokemons.service';
import { NotFoundException } from '@nestjs/common';

describe('PokemonsService', () => {
  let service: PokemonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonsService],
    }).compile();

    service = module.get<PokemonsService>(PokemonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a pokemon', async () => {
    const newPokemon = {
      name: 'Pikachu',
      type: 'Electric',
    };

    const result = await service.create(newPokemon);

    expect(result).toBe(`This actions adds a ${newPokemon.name}`);
  });

  it('should return pokemon if exists', async () => {
    const pokemonId = 4;
    const pokemonResult = {
      id: 4,
      name: 'charmander',
      type: 'fire',
      hp: 39,
      sprites: [
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png',
      ],
    };

    const result = await service.findOne(pokemonId);

    expect(result).toEqual(pokemonResult);
  });

  it("should return 404 error if pokemon doesn't exists", async () => {
    const pokemonId = 4_000_000;

    const result = service.findOne(pokemonId);

    await expect(result).rejects.toThrow(NotFoundException);
    await expect(result).rejects.toThrow(
      `Pokemon with id ${pokemonId} not found`,
    );
  });

  it('should find all pokemons and cache them', async () => {
    const pokemons = await service.findAll({ limit: 10, page: 1 });

    expect(pokemons).toBeInstanceOf(Array);
    expect(pokemons.length).toBe(10);

    expect(service.paginatedPokemonCache.has('10-1')).toBeTruthy();
    expect(service.paginatedPokemonCache.get('10-1')).toEqual(pokemons);
  });

  it('should check properties of the pokemon', async () => {
    const pokemonId = 4;
    const pokemon = await service.findOne(pokemonId);

    expect(pokemon).toHaveProperty('id');
    expect(pokemon).toHaveProperty('name');

    expect(pokemon).toEqual(
      expect.objectContaining({
        id: pokemonId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        hp: expect.any(Number),
      }),
    );
  });
});
