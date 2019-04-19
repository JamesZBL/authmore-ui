let config;

switch (process.env.NODE_ENV) {
  case 'development':
    config = {
      docLink: 'http://localhost:3000/'
    };
    break;
  case 'production':
    config = {
      docLink: 'https://doc.authmore.letec.top/'
    };
    break;
}

export default config;