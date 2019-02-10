import { Base64 } from 'js-base64';

const client =  {
  ci: 'shopapp',
  cs: 123456,
}

export const basic = () => {
  const { ci, cs } = client;
  return Base64.encode(`${ci}:${cs}`);
}