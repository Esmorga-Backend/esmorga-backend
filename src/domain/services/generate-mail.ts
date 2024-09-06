import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GenerateMailService {
  constructor(private configService: ConfigService) {}

  /**
   * Provide the mail elements to send to verificate an account
   *
   * @param code - 6 digits number used as verification code
   * @returns Email data to send (from, subject and mail content in html format)
   */
  getVerificationEmail(code: number) {
    const url = `${this.configService.get('APP_LINK') + '?verificationCode=' + code}`;

    const from = 'Esmorga';

    const subject = 'Solicitud verificación de cuenta';

    const html = `
        <div>
            <p>Hola,</p>
            <p>Hemos recibido una solicitud para registrar un nuevo usuario.
            <p>Para abrir la aplicación y verificar el email, haz clic en el siguiente enlace: <a href=${url}>${url}</a></p>
            <p>Si no te has registrado en nuestra app, ignora este correo electrónico.</p>
            <p>Gracias,</p>
            <p>El equipo de Esmorga</p>
        </div>
        <div>
            <p>&copy; 2024 Esmorga. Todos los derechos reservados.</p>
        </div>`;

    return { from, subject, html };
  }

  /**
   * Provides the mail elements to send to verify the password change of an account.
   *
   * @param code - 6 digits number used as verification code.
   * @returns Email data to send (from, subject and mail content in html format).
   */
  getForgotPasswordEmail(code: string) {
    const url = `${this.configService.get('APP_LINK') + '?forgotPasswordcode=' + code}`;

    const from = 'Esmorga';

    const subject = 'Solicitud cambio de contraseña';

    const html = `
        <div>
            <p>Hola,</p>
            <p>Hemos recibido una solicitud para restablecer tu contraseña.
            <p>Para abrir la aplicación y restablecer tu contraseña, haz clic en el siguiente enlace: <a href=${url}>${url}</a></p>
            <p>Si no solicitaste un restablecimiento de contraseña, ignora este correo electrónico.</p>
            <p>Gracias,</p>
            <p>El equipo de Esmorga</p>
        </div>
        <div>
            <p>&copy; 2024 Esmorga. Todos los derechos reservados.</p>
        </div>`;

    return { from, subject, html };
  }
}
