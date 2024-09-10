import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NodemailerService {
  constructor(
    private readonly logger: PinoLogger,
    private configService: ConfigService,
  ) {}

  /**
   * Sends an email using the configured email service.
   *
   * @param email - The recipient's email address.
   * @param from - The sender's email address.
   * @param subject - The subject of the email.
   * @param html - The email content in HTML format.
   * @param requestId - Request identifier.
   */
  async sendEmail(
    email: string,
    from: string,
    subject: string,
    html: string,
    requestId?: string,
  ) {
    try {
      this.logger.info(
        `[NodemailerService] [sendEmail] - x-request-id: ${requestId}, email: ${email}, subject: ${subject}`,
      );

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: this.configService.get('EMAIL_USER'),
          pass: this.configService.get('EMAIL_PASS'),
        },
      });

      const mailOptions = {
        from,
        to: email,
        subject,
        html,
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      this.logger.error(`[NodemailerService] [sendEmail] - error ${error}`);

      throw error;
    }
  }
}
