Feature: MOB_Feature

	@MOB-TC-5 @JREQ-MOB-19
	Scenario: TC - Get Events API - With upcoming events
	Verify that the GET Events API returns all upcoming events
		Given the GET events API is available
		And 1 events in DB, 0 are in the past
		When a request is made to retrieve events
		Then the response should contain 1 upcoming events
		And the response should following swagger schema