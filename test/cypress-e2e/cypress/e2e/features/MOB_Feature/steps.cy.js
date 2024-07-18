/// <reference types="cypress" />
import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps';
import ApiEvents from '../../pages/events/api_events';
import ApiRefreshToken from '../../pages/account/api_refresh_token';
import ApiLogin from '../../pages/account/api_login';

const api_events = new ApiEvents();
const api_refresh_token = new ApiRefreshToken();
const api_login = new ApiLogin();
var use_endpoint = '';
const api = {
  Events: api_events,
  RefreshToken: api_refresh_token,
  Login: api_login,
};

Given(/^the GET (\w+) API is available$/, (endpoint) => {
  use_endpoint = endpoint;
});
Given(/^the POST (\w+) API is available$/, (endpoint) => {
  use_endpoint = endpoint;
});

When(/^a GET request is made to (\w+) API$/, (endpoint) => {
  api[endpoint].get();
});
When(/^a POST request is made to (\w+) API$/, (endpoint) => {
  api[endpoint].post();
});

And(/^email: (.*)$/, (email) => {
  api[use_endpoint].set_email(email);
});

And(/^password: (.*)$/, (password) => {
  api[use_endpoint].set_password(password);
});

Then(
  /^well-formed success response with status code (\d+) returned$/,
  async (code) => {
    cy.get('@response').then((response) => {
      api[use_endpoint].check_response(code, response);
    });
  },
);
And(
  'use refreshToken from response to store a variable original_refreshToken',
  async () => {
    cy.get('@refreshToken').then((refreshToken) => {
      cy.wrap(refreshToken).as('original_refreshToken');
    });
  },
);
And('use variable original_refreshToken', async () => {
  cy.get('@original_refreshToken').then((original_refreshToken) => {
    cy.wrap(original_refreshToken).as('refreshToken');
  });
});

Then(
  /^well-formed error response with status code (\d+) returned, description: (.*), expected result: (.*)$/,
  async (code, description, result) => {
    cy.get('@response').then((response) => {
      api[use_endpoint].check_error_response(code, result, response);
    });
  },
);
