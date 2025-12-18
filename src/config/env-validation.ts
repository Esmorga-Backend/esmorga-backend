import { plainToInstance } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  validateSync,
  IsPositive,
  IsBoolean,
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
  NODE_ENV: string;

  @IsNotEmpty()
  @IsString()
  JWT_SECRET: string;

  @IsNotEmpty()
  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  ACCESS_TOKEN_TTL: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  MAX_PAIR_OF_TOKEN: number;

  @IsNotEmpty()
  @IsString()
  EMAIL_USER: string;

  @IsNotEmpty()
  @IsString()
  EMAIL_PASS: string;

  @IsNotEmpty()
  @IsString()
  APP_LINK: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  LOGIN_ATTEMPTS_TTL: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  MAX_LOGIN_ATTEMPTS: number;

  @IsNotEmpty()
  @IsString()
  DNS_NAME: string;

  @IsBoolean()
  ENABLE_CORS: boolean = false;

  @IsString()
  CORS_ORIGIN: string = '*';

  @IsNumber()
  @IsPositive()
  API_RATE_LIMIT: number = 100;

  @IsNumber()
  @IsPositive()
  API_RATE_LIMIT_TTL: number = 1;

  @IsNumber()
  @IsPositive()
  PUBLIC_API_RATE_LIMIT: number = 10;

  @IsNumber()
  @IsPositive()
  PUBLIC_API_RATE_LIMIT_TTL: number = 1;
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
