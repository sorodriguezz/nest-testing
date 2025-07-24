import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsController } from './pokemons.controller';
import { PokemonsService } from './pokemons.service';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

const mockPokemons = [
  {
    id: 1,
    name: 'bulbasaur',
    type: 'grass',
    hp: 45,
    sprites: [
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
    ],
  },
  {
    id: 2,
    name: 'ivysaur',
    type: 'grass',
    hp: 60,
    sprites: [
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/2.png',
    ],
  },
];

describe('PokemonsController', () => {
  let controller: PokemonsController;
  let service: PokemonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonsController],
      providers: [PokemonsService],
    }).compile();

    controller = module.get<PokemonsController>(PokemonsController);
    service = module.get<PokemonsService>(PokemonsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have called the service with correct parameter', async () => {
    const dto: PaginationDto = { limit: 10, page: 1 };

    jest.spyOn(service, 'findAll');
    await controller.findAll(dto);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.findAll).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.findAll).toHaveBeenCalledWith(dto);
  });

  it('should have called the service and check the result', async () => {
    const dto: PaginationDto = { limit: 10, page: 1 };

    // simular implementacion sin llamar a la funcion real
    jest
      .spyOn(service, 'findAll')
      .mockImplementation(() => Promise.resolve(mockPokemons));
    const pokemons = await controller.findAll(dto);

    expect(pokemons).toBe(mockPokemons);
  });

  it('should have called the service with correct id (findOne)', async () => {
    const spy = jest
      .spyOn(service, 'findOne')
      .mockImplementation(() => Promise.resolve(mockPokemons[0]));
    const id = '1';

    const pokemon = await controller.findOne(id);

    expect(spy).toHaveBeenCalledWith(+id);

    // el toEqual siempre com objetos
    expect(pokemon).toEqual(mockPokemons[0]);
  });

  it('should have called the service with correct id and data (update)', async () => {
    const id = '1';
    const updatePokemonDto = new UpdatePokemonDto();
    const resp = 'This action updates a #1 pokemon';

    jest
      .spyOn(service, 'update')
      .mockImplementation(() =>
        Promise.resolve('This action updates a #1 pokemon'),
      );

    const result = await controller.update(id, updatePokemonDto);

    expect(result).toBe(resp);
  });

  it('should have called delete with correct id (remove)', async () => {
    const id = '1';

    jest
      .spyOn(service, 'remove')
      .mockImplementation(() =>
        Promise.resolve('This action remove a #1 pokemon'),
      );

    const result = await controller.remove(id);

    expect(result).toBe('This action remove a #1 pokemon');
  });
});
