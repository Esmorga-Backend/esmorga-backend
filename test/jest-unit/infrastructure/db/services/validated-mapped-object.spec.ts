import { validateEventDto } from '../../../../../src/infrastructure/db/services';
import { DataBaseInternalError } from '../../../../../src/infrastructure/db/errors';
import { eventMock } from '../../../../mocks/dtos/event';

describe('[unit-test] [validateEventDto]', () => {
  it('Should throw an error if eventId is missed', () => {
    try {
      const event = { ...eventMock };

      delete event.eventId;

      validateEventDto(event);
    } catch (error) {
      expect(error).toBeInstanceOf(DataBaseInternalError);
    }
  });

  it('Should throw an error if eventName is missed', () => {
    try {
      const event = { ...eventMock };

      delete event.eventName;

      validateEventDto(event);
    } catch (error) {
      expect(error).toBeInstanceOf(DataBaseInternalError);
    }
  });

  it('Should throw an error if eventDate is missed', () => {
    try {
      const event = { ...eventMock };

      delete event.eventDate;

      validateEventDto(event);
    } catch (error) {
      expect(error).toBeInstanceOf(DataBaseInternalError);
    }
  });

  it('Should throw an error if eventType is missed', () => {
    try {
      const event = { ...eventMock };

      delete event.eventType;

      validateEventDto(event);
    } catch (error) {
      expect(error).toBeInstanceOf(DataBaseInternalError);
    }
  });

  it('Should throw an error if description is missed', () => {
    try {
      const event = { ...eventMock };

      delete event.description;

      validateEventDto(event);
    } catch (error) {
      expect(error).toBeInstanceOf(DataBaseInternalError);
    }
  });

  it('Should throw an error if location.name is missed', () => {
    try {
      const event = JSON.parse(JSON.stringify(eventMock));

      delete event.location.name;

      validateEventDto(event);
    } catch (error) {
      expect(error).toBeInstanceOf(DataBaseInternalError);
    }
  });
});
