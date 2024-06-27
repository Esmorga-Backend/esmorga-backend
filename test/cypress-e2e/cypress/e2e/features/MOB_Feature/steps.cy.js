/// <reference types="cypress" />
import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps';
import ApiEvents from '../../pages/api_events';
import ApiRefreshToken from '../../pages/api_refresh_token';
import ApiLogin from '../../pages/api_login';

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

And(
  /^(-?\d+) (\w+) in DB, (-?\d+) are in the past$/,
  (events_on_db, endpoint, expired_events_on_db) => {
    console.log(
      'Need to be deploy add' +
        events_on_db +
        ' and ' +
        expired_events_on_db +
        ' to DB for ' +
        endpoint,
    );
  },
);

When(/^a GET request is made to (\w+) API$/, (endpoint) => {
  api[endpoint].get();
});
When(/^a POST request is made to (\w+) API$/, (endpoint) => {
  api[endpoint].post();
});

Then(
  /^the response should contain (-?\d+) upcoming (\w+)$/,
  (events_to_check, endpoint) => {
    /*
    api[use_endpoint].check_response(events_to_check);
    //  api[endpoint].check_data_response(events_to_check)
*/
  },
);

And('the response should following swagger schema', () => {
  console.log('Need to be deploy swager check for ' + use_endpoint);
});

And(/^email: (.*)$/, (email) => {
  api[use_endpoint].set_email(email);
});

And(/^password: (.*)$/, (password) => {
  api[use_endpoint].set_password(password);
});

And(/^success response code (\d+) returned$/, (code) => {
  api[use_endpoint].check_response(code);
});
And('use response to know original_refreshToken', () => {
  const refresh_token = api[use_endpoint].get_refresh_token();

  api['RefreshToken'].set_refresh_token(refresh_token);
});
And('use refreshToken original_refreshToken', () => {});
And(
  /^error response code (\d+) returned, description: (.*), expected result: (.*)$/,
  (code, description, result) => {},
);

/*
Given the POST Login API is available
		And email: esmorga.test.01@yopmail.com
		And password: Password01
		When a POST request is made to Login API
		Then success response code 201 returned
		And use response to know original_refreshToken
		Given the POST RefreshToken API is available
		And use refreshToken original_refreshToken
		When a POST request is made to RefreshToken API
		Then success response code 201 returned
		Given the POST RefreshToken API is available
		And use refreshToken original_refreshToken
		When a POST request is made to RefreshToken API
		Then error response code 401 returned, description: unauthorizedRequestError
*/
