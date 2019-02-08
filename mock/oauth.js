const clientDetails = [
  {
      "clientId": "crudapp",
      "authorizedGrantTypes": [
          "password"
      ],
      "scoped": true,
      "scope": [
          "user:read"
      ],
      "resourceIds": [],
      "clientSecret": "{pbkdf2}26c3ef9e67659d9dd16fa90d18539d2966c06e25793f02d903c3dc6b102ca3125936461dce16ccbf",
      "authorities": [
          {
              "authority": "NOTIFY"
          },
          {
              "authority": "ADMIN"
          }
      ],
      "registeredRedirectUri": [],
      "accessTokenValiditySeconds": 7200,
      "refreshTokenValiditySeconds": null,
      "additionalInformation": {},
      "password": "{pbkdf2}26c3ef9e67659d9dd16fa90d18539d2966c06e25793f02d903c3dc6b102ca3125936461dce16ccbf",
      "secretRequired": true
  },
  {
      "clientId": "cartapp",
      "authorizedGrantTypes": [
          "authorization_code"
      ],
      "scoped": true,
      "scope": [
          "cart:read"
      ],
      "resourceIds": [],
      "clientSecret": "{pbkdf2}8db5fe5917e53a07d81fce6eeea2db50194f5921c4db3f136123f6f3212339f661e0b6b56fafac96",
      "authorities": [
          {
              "authority": "ADMIN"
          }
      ],
      "registeredRedirectUri": [
          "http://localhost:8084/login"
      ],
      "accessTokenValiditySeconds": 7200,
      "refreshTokenValiditySeconds": null,
      "additionalInformation": {},
      "password": "{pbkdf2}8db5fe5917e53a07d81fce6eeea2db50194f5921c4db3f136123f6f3212339f661e0b6b56fafac96",
      "secretRequired": true
  }
]

const getClientDetails = (req, res) => {
    return res.json({
        list: clientDetails,
        pagination: {
            total: clientDetails.length,
            pageSize: 20,
            current: 1
        }
    });
}

export default {
  'GET /api/client': getClientDetails,
}