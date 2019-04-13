import { Base64 } from 'js-base64';

const client = {
  ci: '5cb0dd412dc963313f1a90b1',
  cs: 123456,
}

export const basic = () => {
  const { ci, cs } = client;
  return Base64.encode(`${ci}:${cs}`);
}

export const RootAppId = client.ci;