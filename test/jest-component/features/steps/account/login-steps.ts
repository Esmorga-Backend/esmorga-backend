import { HttpStatus } from '@nestjs/common';
import { StepDefinitions } from 'jest-cucumber';
import {accountRepository, context, generateTokenPair, tokensRepository} from '../../../steps-config';
import { USER_DB } from '../../../../mocks/db';
  


export const getEventsSteps: StepDefinitions = ({ given, when, and, then }) => {
 given('the POST Login API is available', () => {
    context.path = '/v1/account/login';
    jest.spyOn(accountRepository, 'findOneByEmail').mockResolvedValue(USER_DB);

    jest.spyOn(generateTokenPair, 'generateTokens').mockResolvedValue({
      accessToken: 'ACCESS_TOKEN',
      refreshToken: 'REFRESH_TOKEN',
    });

    jest.spyOn(tokensRepository, 'findByUuid').mockResolvedValue([]);

    jest.spyOn(tokensRepository, 'save').mockResolvedValue();

 });
 and(/^email field correctly filled with (.*)$/, (email) => {
    context.mock.email = email;
 });

 and(/^password field correctly filled with (\w+)$/, (password) => {
    context.mock.password = password;
 });

//  when('a POST request is made to Login', () => {});
 //   then(/^success response code (\d+) returned$/, (arg0) => {});
    and('profile, accessToken and refreshToken are provided with correct schema', () => {});
}