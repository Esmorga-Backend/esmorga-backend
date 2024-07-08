export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
};

export const REQUIRED_DTO_FIELDS = {
  EVENTS: [
    'eventId',
    'eventName',
    'eventDate',
    'eventType',
    'description',
    'location.name',
  ],
  USER_PROFILE: ['uuid', 'name', 'lastName', 'email', 'role'],
};
