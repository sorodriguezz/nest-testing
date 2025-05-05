import { UpdatePokemonDto } from './update-pokemon.dto';
import { validate } from 'class-validator';

describe('update-pokemon.dto.ts', () => {
  it('should be valida with correct data', async () => {
    const dto = new UpdatePokemonDto();

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should valid hp is negative', async () => {
    const dto = new UpdatePokemonDto();
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
    const dto = new UpdatePokemonDto();
    dto.name = 'pikachu';
    dto.type = 'normal';
    dto.hp = 1;

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should valid sprites is a array', async () => {
    const dto = new UpdatePokemonDto();
    dto.name = 'pikachu';
    dto.type = 'normal';
    dto.sprites = ['2'];

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });
});
