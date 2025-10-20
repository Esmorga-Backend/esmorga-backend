export const REQUIRED_DTO_FIELDS = {
  EVENTS: [
    'eventId',
    'eventName',
    'eventDate',
    'eventType',
    'description',
    'location.name',
    'currentAttendeeCount',
  ],
  UPDATE_EVENT: ['eventId'],
  USER_PROFILE: ['uuid', 'name', 'lastName', 'email', 'role'],
};
