import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

function isValidISODate(eventDate: string): boolean {
  const [datePart, timePartWithZ] = eventDate.split('T');
  const timePart = timePartWithZ.replace('Z', '');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute, second, millisecond] = timePart
    .split(/[:.]/)
    .map(Number);
  const date = new Date(
    Date.UTC(year, month - 1, day, hour, minute, second, millisecond),
  );

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day &&
    date.getUTCHours() === hour &&
    date.getUTCMinutes() === minute &&
    date.getUTCSeconds() === second &&
    date.getUTCMilliseconds() === millisecond
  );
}

export function IsValidDate(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: any) {
          if (value === undefined || value === null || value === '')
            return true;
          return typeof value === 'string' && isValidISODate(value);
        },
      },
    });
  };
}

export function IsNotPastDate(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (value === undefined || value === null || value === '')
            return true;
          const date = new Date(value);
          return date > new Date();
        },
      },
    });
  };
}

export function IsNotEmptyArray(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return Array.isArray(value) && value !== null && value.length > 0;
        },
      },
    });
  };
}

export function IsNotEmptyObject(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return (
            typeof value === 'object' &&
            value !== null &&
            Object.keys(value).length > 0
          );
        },
      },
    });
  };
}

export function IsBeforeDateProperty(
  eventDate: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [eventDate],
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (value === undefined || value === null || value === '') {
            return true;
          }

          const [property] = args.constraints;
          const relatedValue = (args.object as Record<string, any>)[property];

          if (
            relatedValue === undefined ||
            relatedValue === null ||
            relatedValue === ''
          ) {
            return true;
          }

          return new Date(value) <= new Date(relatedValue);
        },
      },
    });
  };
}
