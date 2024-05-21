import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, validateSync } from 'class-validator';

class EnviromentVarialbles {
  @IsNotEmpty()
  @IsNumber()
  APP_PORT: number;

  @IsNotEmpty()
  @IsString()
  MONGODB_URI: string;

  @IsNotEmpty()
  @IsString()
  REDIS_HOST: string;

  @IsNotEmpty()
  @IsNumber()
  REDIS_PORT: number;
}

export function validateEnvVariables(config) {
  const validatedConfig = plainToInstance(EnviromentVarialbles, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig);

  if (errors.length) throw new Error(errors.toString());

  return validatedConfig;
}
