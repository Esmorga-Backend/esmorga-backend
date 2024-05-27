/// <reference types="cypress" />
import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";
import ApiEvents from "../../pages/api_events"

const api_events = new ApiEvents()
var use_endpoint=""
const api={
  "events": api_events
}

Given(/^the GET (\w+) API is available$/, (endpoint) => {
  use_endpoint=endpoint
});

And(/^(-?\d+) (\w+) in DB, (-?\d+) are in the past$/, (events_on_db,endpoint,expired_events_on_db) => {
  console.log("Need to be deploy add"+events_on_db+" and "+expired_events_on_db+" to DB for "+endpoint)
});

When(/^a request is made to retrieve (\w+)$/, (endpoint) => {
  api[endpoint].get();
});

Then("the response should contain (-?\d+) upcoming (.*)", (events_to_check,endpoint) => {
  api[endpoint].check_response(events_to_check)
  api[endpoint].check_data_response(events_to_check)
});

AND("the response should following swagger schema", () => {
  console.log("Need to be deploy swager check for "+endpoint)
});


