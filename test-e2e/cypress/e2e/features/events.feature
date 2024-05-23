Feature: Events
  Scenario: Get Events
    Given the GET Events API is available
    And 1 events in DB, 0 are in the past
    When a request is made to retrieve events
    Then the response should contain 1 upcoming events
