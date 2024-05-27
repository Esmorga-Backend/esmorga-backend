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
}

/**
 * Validate if the configuration is according to specified conditions of EnvVars class
 * @param config - An object containing the environment variables to be validated
 * @returns EnvVars validated
 * @throws {Error} - Throw and error if some envVar does not match the implemented decorators
 */
export function validateEnvVars(config) {
  const validatedConfig = plainToInstance(EnvVars, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig);

  if (errors.length) throw new Error(errors.toString());

  return validatedConfig;
}
