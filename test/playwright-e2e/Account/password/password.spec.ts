// import { test, expect } from '@playwright/test';
// import { loginAdminUser, loginUser, logoutUser } from '../../Common/Login';

// test(
//   'Change password',
//   {
//     tag: '@happy-path',
//   },
//   async ({ request }) => {
//     const responseLogin = await loginUser(request);
//     const responseLoginJson = await responseLogin.json();
//     const accessToken = responseLoginJson.accessToken;

//     const responseChangePassword = await request.put('/v1/account/password/', {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//       data: {
//         currentPassword: 'oldPassword',
//         newPassword: 'newPassword',
//       },
//     });

//     expect(responseChangePassword.status()).toBe(200);
//     const responseChangePasswordJson = await responseChangePassword.json();
//     expect(responseChangePasswordJson).toHaveProperty('accessToken');
//     expect(responseChangePasswordJson).toHaveProperty('refreshToken');
//     expect(responseChangePasswordJson).toHaveProperty('ttl');

//     // Logout user
//     await logoutUser(request, accessToken);
//   },
// );
