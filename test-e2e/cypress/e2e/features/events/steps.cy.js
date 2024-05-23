/// <reference types="cypress" />
import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";
import ApiEvents from "../../pages/api_events"

const api_events = new ApiEvents()
var use_endpoint=""
const api={
  "Events": api_events
}

Given(/^the GET (.*) API is available$/, (endpoint) => {
  use_endpoint=endpoint
});

And(/^(-?\d+) events in DB, (-?\d+) are in the past$/, () => {
  console.log("Need to be deploy")
});

When("a request is made to retrieve events", () => {
  api[use_endpoint].get();
});

Then("the response should contain 1 upcoming events", () => {
  api[use_endpoint].check_response()
});

Then("the response should following swagger schema", () => {
  console.log("Need to be deploy")
});


