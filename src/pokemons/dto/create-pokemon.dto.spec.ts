import { validate } from 'class-validator';
import { CreatePokemonDto } from './create-pokemon.dto';

describe('create-pokemon.dto.ts', () => {
  it('should be valida with correct data', async () => {
    const dto = new CreatePokemonDto();
    dto.type = 'normal';
    dto.name = 'pikachu';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should valid name is not empty', async () => {
    const dto = new CreatePokemonDto();
    dto.type = 'normal';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);

    errors.forEach((error) => {
      if (error.property === 'name') {
        expect(error.constraints?.isString).toBeDefined();
        expect(error.constraints?.isNotEmpty).toBeDefined();
      } else {
        expect(true).toBeFalsy();
      }
    });
  });

  it('should valid type is not empty', async () => {
    const dto = new CreatePokemonDto();
    dto.name = 'pikachu';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);

    errors.forEach((error) => {
      if (error.property === 'type') {
        expect(error.constraints?.isString).toBeDefined();
        expect(error.constraints?.isNotEmpty).toBeDefined();
      } else {
        expect(true).toBeFalsy();
      }
    });
  });

  it('should valid hp is negative', async () => {
    const dto = new CreatePokemonDto();
    dto.name = 'pikachu';
    dto.type = 'normal';
    dto.hp = -1;

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);

    errors.forEach((error) => {
      if (error.property === 'hp') {
        expect(error.constraints?.min).toBeDefined();
      } else {
        expect(true).toBeFalsy();
      }
    });
  });

  it('should valid hp is positive', async () => {
    const dto = new CreatePokemonDto();
    dto.name = 'pikachu';
    dto.type = 'normal';
    dto.hp = 1;

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should valid sprites is a array', async () => {
    const dto = new CreatePokemonDto();
    dto.name = 'pikachu';
    dto.type = 'normal';
    dto.sprites = ['2'];

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });
});
