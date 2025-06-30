import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotAcceptableResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import {
  ACTIVATE_ACCOUNT_HEADERS,
  FORGOT_PASSWORD_UPDATE_HEADERS,
  CLOSE_CURRENT_SESSION_HEADERS,
  DISJOIN_EVENT_HEADERS,
  FORGOT_PASSWORD_HEADER,
  GET_MY_EVENT_HEADERS,
  JOIN_EVENT_HEADERS,
  LOGIN_HEADERS,
  REFRESH_TOKEN_HEADERS,
  REGISTER_HEADER,
  SEND_EMAIL_VERIFICATION_HEADER,
} from '../headers';
import {
  ACTIVATE_ACCOUNT_RESPONSES,
  CLOSE_CURRENT_SESSION_RESPONSES,
  DISJOIN_EVENT_RESPONSES,
  FORGOT_PASSWORD_RESPONSES,
  FORGOT_PASSWORD_UPDATE_RESPONSE,
  GET_MY_EVENTS_RESPONSES,
  JOIN_EVENT_RESPONSES,
  LOGIN_RESPONSES,
  REFRESH_TOKEN_RESPONSES,
  REGISTER_RESPONSES,
  SEND_EMAIL_VERIFICATION_RESPONSES,
} from '../responses';

export function SwaggerAccountLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'Login an user.' }),
    ApiHeader(LOGIN_HEADERS),
    ApiOkResponse(LOGIN_RESPONSES.OK),
    ApiBadRequestResponse(LOGIN_RESPONSES.BAD_REQUEST_ERROR),
    ApiForbiddenResponse(LOGIN_RESPONSES.FORBIDDEN_ERROR),
    ApiUnauthorizedResponse(LOGIN_RESPONSES.UNAUTHORIZED_ERROR),
    ApiTooManyRequestsResponse(LOGIN_RESPONSES.TOO_MANY_REQUESTS_ERROR),
    ApiInternalServerErrorResponse(LOGIN_RESPONSES.INTERNAL_ERROR),
    ApiResponse({
      status: 423,
      ...LOGIN_RESPONSES.BLOCKED_ACCOUNT_ERROR,
    }),
  );
}

export function SwaggerAccountRegister() {
  return applyDecorators(
    ApiOperation({ summary: 'Register a new user' }),
    ApiHeader(REGISTER_HEADER),
    ApiCreatedResponse(REGISTER_RESPONSES.CREATED),
    ApiBadRequestResponse(REGISTER_RESPONSES.BAD_REQUEST_ERROR),
    ApiInternalServerErrorResponse(LOGIN_RESPONSES.INTERNAL_ERROR),
  );
}

export function SwaggerRefreshToken() {
  return applyDecorators(
    ApiOperation({ summary: 'Refresh token.' }),
    ApiHeader(REFRESH_TOKEN_HEADERS),
    ApiOkResponse(REFRESH_TOKEN_RESPONSES.OK),
    ApiBadRequestResponse(REFRESH_TOKEN_RESPONSES.BAD_REQUEST_ERROR),
    ApiUnauthorizedResponse(REFRESH_TOKEN_RESPONSES.UNAUTHORIZED_ERROR),
    ApiTooManyRequestsResponse(REFRESH_TOKEN_RESPONSES.TOO_MANY_REQUESTS_ERROR),
    ApiInternalServerErrorResponse(REFRESH_TOKEN_RESPONSES.INTERNAL_ERROR),
  );
}

export function SwaggerJoinEvent() {
  return applyDecorators(
    ApiOperation({
      summary: 'Allow authenticated users to join as participants in an event.',
    }),
    ApiBearerAuth(),
    ApiHeader(JOIN_EVENT_HEADERS.AUTHORIZATION_BEARER),
    ApiHeader(JOIN_EVENT_HEADERS.CONTENT_TYPE),
    ApiNoContentResponse(JOIN_EVENT_RESPONSES.NO_CONTENT),
    ApiBadRequestResponse(JOIN_EVENT_RESPONSES.BAD_REQUEST_ERROR),
    ApiUnauthorizedResponse(JOIN_EVENT_RESPONSES.UNAUTHORIZED_ERROR),
    ApiNotAcceptableResponse(JOIN_EVENT_RESPONSES.NOT_ACCEPTABLE_ERROR),
    ApiTooManyRequestsResponse(JOIN_EVENT_RESPONSES.TOO_MANY_REQUESTS_ERROR),
    ApiInternalServerErrorResponse(JOIN_EVENT_RESPONSES.INTERNAL_ERROR),
  );
}

export function SwaggerDisjoinEvent() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Allow authenticated users to disjoin as participants from an event.',
    }),
    ApiBearerAuth(),
    ApiHeader(DISJOIN_EVENT_HEADERS.AUTHORIZATION_BEARER),
    ApiHeader(DISJOIN_EVENT_HEADERS.CONTENT_TYPE),
    ApiNoContentResponse(DISJOIN_EVENT_RESPONSES.NO_CONTENT),
    ApiBadRequestResponse(DISJOIN_EVENT_RESPONSES.BAD_REQUEST_ERROR),
    ApiUnauthorizedResponse(DISJOIN_EVENT_RESPONSES.UNAUTHORIZED_ERROR),
    ApiNotAcceptableResponse(DISJOIN_EVENT_RESPONSES.NOT_ACCEPTABLE_ERROR),
    ApiTooManyRequestsResponse(DISJOIN_EVENT_RESPONSES.TOO_MANY_REQUESTS_ERROR),
    ApiInternalServerErrorResponse(DISJOIN_EVENT_RESPONSES.INTERNAL_ERROR),
  );
}

export function SwaggerGetMyEvents() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Return a list of events the user joined and have not been celebrated.',
    }),
    ApiHeader(GET_MY_EVENT_HEADERS.AUTHORIZATION_BEARER),
    ApiOkResponse(GET_MY_EVENTS_RESPONSES.OK),
    ApiUnauthorizedResponse(GET_MY_EVENTS_RESPONSES.UNAUTHORIZED_ERROR),
    ApiTooManyRequestsResponse(GET_MY_EVENTS_RESPONSES.TOO_MANY_REQUESTS_ERROR),
    ApiInternalServerErrorResponse(GET_MY_EVENTS_RESPONSES.INTERNAL_ERROR),
  );
}

export function SwaggerForgotPassword() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Allow users to send an email with a code to request the change of a forgotten password.',
    }),
    ApiHeader(FORGOT_PASSWORD_HEADER),
    ApiNoContentResponse(FORGOT_PASSWORD_RESPONSES.NO_CONTENT),
    ApiBadRequestResponse(FORGOT_PASSWORD_RESPONSES.BAD_REQUEST_ERROR),
    ApiTooManyRequestsResponse(
      FORGOT_PASSWORD_RESPONSES.TOO_MANY_REQUESTS_ERROR,
    ),
    ApiInternalServerErrorResponse(FORGOT_PASSWORD_RESPONSES.INTERNAL_ERROR),
  );
}

export function SwaggerForgotPasswordUpdate() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update password for the account code provided belongs.',
    }),
    ApiHeader(FORGOT_PASSWORD_UPDATE_HEADERS),
    ApiNoContentResponse(FORGOT_PASSWORD_UPDATE_RESPONSE.NO_CONTENT),
    ApiBadRequestResponse(FORGOT_PASSWORD_UPDATE_RESPONSE.BAD_REQUEST_ERROR),
    ApiTooManyRequestsResponse(
      FORGOT_PASSWORD_UPDATE_RESPONSE.TOO_MANY_REQUESTS_ERROR,
    ),
    ApiInternalServerErrorResponse(
      FORGOT_PASSWORD_UPDATE_RESPONSE.INTERNAL_ERROR,
    ),
  );
}

export function SwaggerSendEmailVerification() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Send a verification email if the last code expires, as long as the account is not active or blocked.',
    }),
    ApiHeader(SEND_EMAIL_VERIFICATION_HEADER),
    ApiNoContentResponse(SEND_EMAIL_VERIFICATION_RESPONSES.NO_CONTENT),
    ApiBadRequestResponse(SEND_EMAIL_VERIFICATION_RESPONSES.BAD_REQUEST_ERROR),
    ApiTooManyRequestsResponse(
      SEND_EMAIL_VERIFICATION_RESPONSES.TOO_MANY_REQUESTS_ERROR,
    ),
    ApiInternalServerErrorResponse(
      SEND_EMAIL_VERIFICATION_RESPONSES.INTERNAL_ERROR,
    ),
  );
}

export function SwaggerActivateAccount() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Update account status to ACTIVE for user the verificationCode is related.',
    }),
    ApiHeader(ACTIVATE_ACCOUNT_HEADERS),
    ApiOkResponse(ACTIVATE_ACCOUNT_RESPONSES.OK),
    ApiBadRequestResponse(ACTIVATE_ACCOUNT_RESPONSES.BAD_REQUEST_ERROR),
    ApiTooManyRequestsResponse(
      ACTIVATE_ACCOUNT_RESPONSES.TOO_MANY_REQUESTS_ERROR,
    ),
    ApiInternalServerErrorResponse(ACTIVATE_ACCOUNT_RESPONSES.INTERNAL_ERROR),
  );
}

export function SwaggerCloseCurrentSession() {
  return applyDecorators(
    ApiOperation({
      summary: 'Close current session.',
    }),
    ApiBearerAuth(),
    ApiHeader(CLOSE_CURRENT_SESSION_HEADERS.AUTHORIZATION_BEARER),
    ApiHeader(CLOSE_CURRENT_SESSION_HEADERS.CONTENT_TYPE),
    ApiNoContentResponse(CLOSE_CURRENT_SESSION_RESPONSES.NO_CONTENT),
    ApiBadRequestResponse(CLOSE_CURRENT_SESSION_RESPONSES.BAD_REQUEST_ERROR),
    ApiTooManyRequestsResponse(
      CLOSE_CURRENT_SESSION_RESPONSES.TOO_MANY_REQUESTS_ERROR,
    ),
    ApiInternalServerErrorResponse(
      CLOSE_CURRENT_SESSION_RESPONSES.INTERNAL_ERROR,
    ),
  );
}
