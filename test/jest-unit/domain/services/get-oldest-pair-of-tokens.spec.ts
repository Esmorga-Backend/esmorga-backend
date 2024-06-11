import { PairOfTokensDTO } from '../../../../src/infraestructure/dtos';
import { getOldestPairOfTokens } from '../../../../src/domain/services';

const CURRENT_DATE: Date = new Date();

const OLD_DATE: Date = new Date();
OLD_DATE.setFullYear(2020);

describe('[unit-test] [getOldestPairOfTokens]', () => {
  it('Should return the id related to the oldest created pair of tokens', () => {
    const PAIR_OF_TOKENS: PairOfTokensDTO[] = [
      {
        id: 'ID_FIRST_CREATED',
        uuid: '665f019c17331ebee550b2fd',
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNjY1ZjAxOWMxNzMzMWViZWU1NTBiMmZkIiwiaWF0IjoxNzE4MDI1MDUxLCJleHAiOjE3MTgwMjU2NTF9.HrlFuJVleUKnfMB_vJcqr14AUtFGX_DTvv31rUMv2no',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNjY1ZjAxOWMxNzMzMWViZWU1NTBiMmZkIiwiaWF0IjoxNzE4MDI1MDUxfQ.btRIuZLJrZ53OwS7oaVr_4nm1CDGZDZhbbozNhCOsCs',
        createdAt: OLD_DATE,
        updatedAt: CURRENT_DATE,
      },
      {
        id: '666709d1790821899ed709e5',
        uuid: '665f019c17331ebee550b2fd',
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNjY1ZjAxOWMxNzMzMWViZWU1NTBiMmZkIiwiaWF0IjoxNzE4MDI4NzUzLCJleHAiOjE3MTgwMjkzNTN9.7jmmW_drm9qY-5ioX1LJfSTEW46sbMuUjtTeynTXu8U',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNjY1ZjAxOWMxNzMzMWViZWU1NTBiMmZkIiwiaWF0IjoxNzE4MDI4NzUzfQ.3z6NTSwSG3ALiNon3LLXddn5ibg_cHBOUvNQaVAPKXI',
        createdAt: CURRENT_DATE,
        updatedAt: CURRENT_DATE,
      },
      {
        id: '6667122aaba2d112a0866eaf',
        uuid: '665f019c17331ebee550b2fd',
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNjY1ZjAxOWMxNzMzMWViZWU1NTBiMmZkIiwiaWF0IjoxNzE4MDMwODkwLCJleHAiOjE3MTgwMzE0OTB9.Dm-Gl3tgNxCNBSbnQvo3vlLkvXyLW9G0GAkog8ZqVgg',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNjY1ZjAxOWMxNzMzMWViZWU1NTBiMmZkIiwiaWF0IjoxNzE4MDMwODkwfQ.mKJMZMPu6BiXS8DDwD9_ImLkkA16TFJkOeZfhkHR8Ow',
        createdAt: CURRENT_DATE,
        updatedAt: CURRENT_DATE,
      },
      {
        id: '6667126bce293bd8bab1a7fb',
        uuid: '665f019c17331ebee550b2fd',
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNjY1ZjAxOWMxNzMzMWViZWU1NTBiMmZkIiwiaWF0IjoxNzE4MDMwOTU1LCJleHAiOjE3MTgwMzE1NTV9.DsbdVixu1LLiHLSdobbBlrdGw0yV0pjZncVPRqua5wU',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNjY1ZjAxOWMxNzMzMWViZWU1NTBiMmZkIiwiaWF0IjoxNzE4MDMwOTU1fQ.Wv1VDIvWIjXiAAQYu3XHFafL5qxgxocJ-xlW96rJ6ac',
        createdAt: CURRENT_DATE,
        updatedAt: CURRENT_DATE,
      },
    ];

    const response = getOldestPairOfTokens(PAIR_OF_TOKENS);

    expect(response).toBe('ID_FIRST_CREATED');
  });
});
