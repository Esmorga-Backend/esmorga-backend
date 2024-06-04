Feature: MOB_Feature

	@MOB-TC-3 @JREQ-MOB-19
	Scenario: TC - Get Events API - With no available events
	Verify that the GET Events API returns an empty array when there are no upcoming events
		Given the GET Events API is available
		And 0 Events in DB, 0 are in the past
		When a GET request is made to Events API
		Then the response should contain 0 upcoming Events