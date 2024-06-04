Feature: MOB_Feature

	@MOB-TC-5 @JREQ-MOB-19
	Scenario: TC - Get Events API - With upcoming events
	Verify that the GET Events API returns all upcoming events
		Given the GET Events API is available
		And 1 Events in DB, 0 are in the past
		When a GET request is made to Events API
		Then the response should contain 1 upcoming Events
		And the response should following swagger schema

	@MOB-TC-6 @JREQ-MOB-19
	Scenario: TC - Get Events API - With upcoming events filtered
	Verify that the GET Events API returns all upcoming events 
		Given the GET Events API is available
		And 4 Events in DB, 1 are in the past
		When a GET request is made to Events API
		Then the response should contain 3 upcoming Events