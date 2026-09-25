import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import * as https from 'https';

export interface SendPushNotificationParams {
  heading: string;
  content: string;
  data?: unknown;
}

@Injectable()
export class OnesignalService {
  constructor(
    private readonly logger: PinoLogger,
    private configService: ConfigService,
  ) { }

  /**
   * Sends a push notification via OneSignal.
   *
   * @param params.heading - The notification heading (plain text, will be wrapped in language object).
   * @param params.content - The notification body content (plain text, will be wrapped in language object).
   * @param params.environment - The environment filter value (e.g., "qa", "production").
   * @param params.apiKey - The OneSignal REST API key for authorization.
   */
  async sendPushNotification(params: SendPushNotificationParams): Promise<void> {
    const { heading, content, data } = params;
    const apiBaseUrl: string = this.configService.get('ONESIGNAL_API_BASE_URL');
    const appId: string = this.configService.get('ONESIGNAL_APP_ID');
    const apiKey: string = this.configService.get('ONESIGNAL_REST_API_KEY');
    const appEnv: string = this.configService.get('APP_ENV').toLowerCase();

    if (!apiBaseUrl?.length || !appId?.length || !apiKey?.length) {
      this.logger.error(`[OnesignalService] [sendPushNotification] - error: Missing env`);
      throw new Error(`Missing env for OneSignal`);
    }
    this.logger.info(
      `[OnesignalService] [sendPushNotification] - heading: ${heading}, environment: ${appEnv}`,
    );

    const payload = {
      app_id: appId,
      headings: { en: heading },
      contents: { en: content },
      mutable_content: true,
      filters: [{ field: 'tag', key: 'environment', relation: '=', value: appEnv }],
      data: { "type": "event-created", ...(typeof data === 'object' ? data : {}) },
    };

    try {
      const { statusCode, responseBody } = await this.makeRequest(
        `${apiBaseUrl}/notifications?c=push`,
        payload,
        apiKey,
      );

      if (statusCode >= 200 && statusCode < 300) {
        this.logger.info(
          `[OnesignalService] [sendPushNotification] - response status: ${statusCode}, data: ${responseBody}`,
        );
        return;
      }

      this.logger.error(
        `[OnesignalService] [sendPushNotification] - error status: ${statusCode}, data: ${responseBody}`,
      );
      throw new Error(
        `OneSignal request failed with status ${statusCode}: ${responseBody}`,
      );
    } catch (error) {
      this.logger.error(
        `[OnesignalService] [sendPushNotification] - error: ${error}`,
      );
      throw error;
    }
  }

  private makeRequest(
    url: string,
    payload: unknown,
    apiKey: string,
  ): Promise<{ statusCode: number; responseBody: string }> {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify(payload);
      const options: https.RequestOptions = {
        method: 'POST',
        headers: {
          'Authorization': `Key ${apiKey}`,
          'content-type': 'application/json',
          'accept': 'application/json',
          // 'Content-Length': Buffer.byteLength(body),
        },
      };

      const req = https.request(url, options, (res) => {
        let responseData = '';

        res.on('data', (chunk: string | Buffer) => {
          responseData += chunk.toString();
        });

        res.on('end', () => {
          resolve({ statusCode: res.statusCode, responseBody: responseData });
        });
      });

      req.on('error', (error: Error) => {
        reject(error);
      });

      req.write(body);
      req.end();
    });
  }
}
