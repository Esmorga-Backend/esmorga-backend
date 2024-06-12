import {
  validateObjectDto,
  REQUIRED_FIELDS,
} from '../../../../../src/infrastructure/db/services';
import { DataBaseInternalError } from '../../../../../src/infrastructure/db/errors';
import { EVENT_MOCK, USER_PROFILE } from '../../../../mocks/dtos';

describe('[unit-test] [validateObjectDto]', () => {
  describe('[EventDto]', () => {
    it('Should throw an error if eventId is missed', () => {
      try {
        const event = { ...EVENT_MOCK };

        delete event.eventId;

        validateObjectDto(event, REQUIRED_FIELDS.EVENTS);
      } catch (error) {
        expect(error).toBeInstanceOf(DataBaseInternalError);
      }
    });

    it('Should throw an error if eventName is missed', () => {
      try {
        const event = { ...EVENT_MOCK };

        delete event.eventName;

        validateObjectDto(event, REQUIRED_FIELDS.EVENTS);
      } catch (error) {
        expect(error).toBeInstanceOf(DataBaseInternalError);
      }
    });

    it('Should throw an error if eventDate is missed', () => {
      try {
        const event = { ...EVENT_MOCK };

        delete event.eventDate;

        validateObjectDto(event, REQUIRED_FIELDS.EVENTS);
      } catch (error) {
        expect(error).toBeInstanceOf(DataBaseInternalError);
      }
    });

    it('Should throw an error if eventType is missed', () => {
      try {
        const event = { ...EVENT_MOCK };

        delete event.eventType;

        validateObjectDto(event, REQUIRED_FIELDS.EVENTS);
      } catch (error) {
        expect(error).toBeInstanceOf(DataBaseInternalError);
      }
    });

    it('Should throw an error if description is missed', () => {
      try {
        const event = { ...EVENT_MOCK };

        delete event.description;

        validateObjectDto(event, REQUIRED_FIELDS.EVENTS);
      } catch (error) {
        expect(error).toBeInstanceOf(DataBaseInternalError);
      }
    });

    it('Should throw an error if location.name is missed', () => {
      try {
        const event = JSON.parse(JSON.stringify(EVENT_MOCK));

        delete event.location.name;

        validateObjectDto(event, REQUIRED_FIELDS.EVENTS);
      } catch (error) {
        expect(error).toBeInstanceOf(DataBaseInternalError);
      }
    });
  });

  describe('[UserProfileDto]', () => {
    it('Should throw an error if uuid is missed', () => {
      try {
        const userProfile = { ...USER_PROFILE };

        delete userProfile.uuid;

        validateObjectDto(userProfile, REQUIRED_FIELDS.USER_PROFILE);
      } catch (error) {
        expect(error).toBeInstanceOf(DataBaseInternalError);
      }
    });

    it('Should throw an error if name is missed', () => {
      try {
        const userProfile = { ...USER_PROFILE };

        delete userProfile.name;

        validateObjectDto(userProfile, REQUIRED_FIELDS.USER_PROFILE);
      } catch (error) {
        expect(error).toBeInstanceOf(DataBaseInternalError);
      }
    });

    it('Should throw an error if lastName is missed', () => {
      try {
        const userProfile = { ...USER_PROFILE };

        delete userProfile.lastName;

        validateObjectDto(userProfile, REQUIRED_FIELDS.USER_PROFILE);
      } catch (error) {
        expect(error).toBeInstanceOf(DataBaseInternalError);
      }
    });

    it('Should throw an error if email is missed', () => {
      try {
        const userProfile = { ...USER_PROFILE };

        delete userProfile.email;

        validateObjectDto(userProfile, REQUIRED_FIELDS.USER_PROFILE);
      } catch (error) {
        expect(error).toBeInstanceOf(DataBaseInternalError);
      }
    });

    it('Should throw an error if role is missed', () => {
      try {
        const userProfile = { ...USER_PROFILE };

        delete userProfile.role;

        validateObjectDto(userProfile, REQUIRED_FIELDS.USER_PROFILE);
      } catch (error) {
        expect(error).toBeInstanceOf(DataBaseInternalError);
      }
    });
  });
});
