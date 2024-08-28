import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GenerateMailService {
  constructor(private configService: ConfigService) {}

  /**
   * Return a number with the length specifiec by parameter and random value.
   *
   * @param digitsLength - Number of total digits. Default value 6
   * @returns Code with leght specified
   */
  generateCode(digitsLength: number = 6): number {
    const min = Math.pow(10, digitsLength - 1);

    const max = Math.pow(10, digitsLength) - 1;

    return Math.floor(min + Math.random() * (max - min + 1));
  }

  /**
   * Provide the mail elements to send to verificate an account
   *
   * @param code - 6 digits number used as verification code
   * @returns Email data to send
   */
  async getVerificationEmail(code: number) {
    const url = `${this.configService.get('APP_LINK') + '?verificationCode=' + code}`;

    const from = 'Esmorga';

    const subject = 'Solicitud cambio de contraseña';

    const html = `
        <div>
            <p>Hola,</p>
            <p>Hemos recibido una solicitud para registrar un nuevo usuario.
            <p>Para abrir la aplicación y verificar el email, haz clic en el siguiente enlace: ${url}</p>
            <p>Si no te has registrado en nuestra app, ignora este correo electrónico.</p>
            <p>Gracias,</p>
            <p>El equipo de Esmorga</p>
        </div>
        <div>
            <p>&copy; 2024 Esmorga. Todos los derechos reservados.</p>
        </div>`;

    return { from, subject, html };
  }
}
