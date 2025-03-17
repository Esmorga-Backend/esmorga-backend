/// <reference types="cypress" />
import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps';
import ApiEvents from '../../pages/events/api_events';
import ApiRefreshToken from '../../pages/account/api_refresh_token';
import ApiLogin from '../../pages/account/api_login';
import ApiJoinEvent from '../../pages/account/api_join_event';
import ApiForgotPassword from '../../pages/account/password/api_forgot_password';
import ApiPasswordUpdate from '../../pages/account/password/api_password_update';
import ApiRegisteter from '../../pages/account/api_register';
import ApiActivate from '../../pages/account/api_activate';

const api_events = new ApiEvents();
const api_refresh_token = new ApiRefreshToken();
const api_login = new ApiLogin();
const api_forgot_password = new ApiForgotPassword();
const api_join_event = new ApiJoinEvent();
const api_password_update = new ApiPasswordUpdate();
const api_register = new ApiRegisteter();
const api_activate = new ApiActivate();

var use_endpoint = '';
const api = {
  Events: api_events,
  'Join Event': api_join_event,
  RefreshToken: api_refresh_token,
  Login: api_login,
  'Forgot Password': api_forgot_password,
  'Password Update': api_password_update,
  Register: api_register,
  'Activate account': api_activate,
};

Given(/^the GET (.*) API is available$/, (endpoint) => {
  use_endpoint = endpoint;
});
Given(/^the POST (.*) API is available$/, (endpoint) => {
  use_endpoint = endpoint;
});
Given(/^the PATCH (.*) API is available$/, (endpoint) => {
  use_endpoint = endpoint;
});
Given(/^the PUT (.*) API is available$/, (endpoint) => {
  use_endpoint = endpoint;
});

When(/^a GET request is made to (.*) API$/, () => {
  api[use_endpoint].get();
});
When(/^a POST request is made to (.*) API$/, () => {
  api[use_endpoint].post();
});
When(/^a PATCH request is made to (.*) API$/, () => {
  api[use_endpoint].patch();
});
When(/^a PUT request is made to (.*) API$/, () => {
  api[use_endpoint].put();
  //  cy.log('TEST');
});

And(/^email: (.*)$/, (email) => {
  api[use_endpoint].set_email(email);
});

And(/^password: (.*)$/, (password) => {
  api[use_endpoint].set_password(password);
});
And(/^(.*) field correctly filled with (.*)$/, (field, text) => {
  api[use_endpoint].set_field(field, text);
});

And(/^default password$/, () => {
  api[use_endpoint].restore_password();
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

Then('reset password email with correct format is received', async () => {
  api_forgot_password.check_email();
  cy.get('@email').then((email) => {
    expect(email).to.match(
      /(.*)Hemos recibido una solicitud para restablecer tu contraseña.(.*)/,
    );
    expect(email).to.match(/(.*)forgotPasswordCode=(.*)/);
    api_password_update.get_forgotPasswordCode_from_mail(email);
    api_password_update.set_email(api_forgot_password.get_email_dir());
  });
});
Then('account confirmation email is sent', async () => {
  api_register.check_email();
  cy.get('@email').then((email) => {
    expect(email).to.match(
      /(.*)Hemos recibido una solicitud para registrar un nuevo usuario.(.*)/,
    );
    expect(email).to.match(/(.*)verificationCode=(.*)/);
    api_activate.get_verificationCode_from_mail(email);
    cy.log('code: ' + api_activate.get_verificationCode());
  });
});
Then('forgot password code via email is used', async () => {
  // THIS STEP IS OBSOLET
  // cy.get('@email').then((email) => {
  //   api['Password Update'].set_forgotPasswordCode(
  //     email.body.split('forgotPasswordCode=')[1].split('>')[0],
  //   );
  // api['Password Update'].set_email(api['Forgot Password'].get_email());
  //  });
});

Then('the user can now log in with the new password', async () => {
  api[use_endpoint].set_password(api['Password Update'].get_password());
  api[use_endpoint].set_email(api['Password Update'].get_email());
});
