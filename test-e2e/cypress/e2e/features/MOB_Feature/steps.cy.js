/// <reference types="cypress" />
import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";
import ApiEvents from "../../pages/api_events"

const api_events = new ApiEvents()
var use_endpoint=""
const api={
  "Events": api_events
  "Events": api_events
}

Given(/^the GET (\w+) API is available$/, (endpoint) => {
  use_endpoint=endpoint
});

And(/^(-?\d+) (\w+) in DB, (-?\d+) are in the past$/, (events_on_db,endpoint,expired_events_on_db) => {
  console.log("Need to be deploy add"+events_on_db+" and "+expired_events_on_db+" to DB for "+endpoint)
});

When(/^a GET request is made to (\w+) API$/, (endpoint) => {
  api[endpoint].get();
});

Then(/^the response should contain (-?\d+) upcoming (\w+)$/, (events_to_check,endpoint) => {
  api[endpoint].check_response(events_to_check)
//  api[endpoint].check_data_response(events_to_check)
});

And("the response should following swagger schema", () => {
  console.log("Need to be deploy swager check for "+use_endpoint)
});



