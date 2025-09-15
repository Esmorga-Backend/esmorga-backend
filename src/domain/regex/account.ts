// Regex for name and lastName is the same one
export const ACCOUNT_REGEX = {
  NAME: /^[A-Za-z\s'-]+$/,
  EMAIL: /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD: /(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!-/:-@\[-`{-~])\S+$/,
};
