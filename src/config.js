const config = {
  development: {
    docLink: 'http://localhost:3000/'
  },

  production: {
    docLink: 'https://doc.authmore.letec.top/'
  }
}

export default config[process.env.NODE_ENV];