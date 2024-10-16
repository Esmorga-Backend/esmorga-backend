import { SessionDto } from '../../../../src/infrastructure/dtos';
import { getOldestSession } from '../../../../src/domain/services';

const CURRENT_DATE: Date = new Date();

const OLD_DATE: Date = new Date();
OLD_DATE.setFullYear(2020);

describe('[unit-test] [getOldestSession]', () => {
  it('Should return the id related to the oldest created session', () => {
    const PAIR_OF_TOKENS: SessionDto[] = [
      {
        id: 'ID_FIRST_CREATED',
        uuid: '665f019c17331ebee550b2fd',
        sessionId: '665f019c17331ebee550b2rd',
        createdAt: OLD_DATE,
        updatedAt: CURRENT_DATE,
      },
      {
        id: '666709d1790821899ed709e5',
        uuid: '665f019c17331ebee550b2fd',
        sessionId: '665f019c17331ebee550b2rd',
        createdAt: CURRENT_DATE,
        updatedAt: CURRENT_DATE,
      },
      {
        id: '6667122aaba2d112a0866eaf',
        uuid: '665f019c17331ebee550b2fd',
        sessionId: '665f019c17331ebee550b2rd',
        createdAt: CURRENT_DATE,
        updatedAt: CURRENT_DATE,
      },
      {
        id: '6667126bce293bd8bab1a7fb',
        uuid: '665f019c17331ebee550b2fd',
        sessionId: '665f019c17331ebee550b2rd',
        createdAt: CURRENT_DATE,
        updatedAt: CURRENT_DATE,
      },
    ];

    const response = getOldestSession(PAIR_OF_TOKENS);

    expect(response).toBe('ID_FIRST_CREATED');
  });
});
