import { plainToInstance } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  validateSync,
  IsPositive,
} from 'class-validator';

class EnvVars {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  APP_PORT: number;

  @IsNotEmpty()
  @IsString()
  MONGODB_URI: string;

  @IsNotEmpty()
  @IsString()
  REDIS_HOST: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  REDIS_PORT: number;
}

export function validateEnvVars(config) {
  const validatedConfig = plainToInstance(EnvVars, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig);

  if (errors.length) throw new Error(errors.toString());

  return validatedConfig;
}
