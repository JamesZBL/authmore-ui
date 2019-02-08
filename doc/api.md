# 接口文档

## OAuth Client

GET     /client
```json
[
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
```

POST    /client   
```json
{
    "clientId": "crudapp",
    "resourceIds": null,
    "clientSecret": "123456",
    "authorities": "ADMIN,NOTIFY",
    "accessTokenValiditySeconds": 7200,
    "refreshTokenValiditySeconds": null,
    "additionalInformation": "",
    "scope": "user:read",
    "authorizedGrantTypes": "password",
    "registeredRedirectUri": null,
    "scoped": true,
    "secretRequired": true
}
```

PUT     /client
```json
{
    "clientId": "crudapp",
    "resourceIds": null,
    "clientSecret": "123456",
    "authorities": "ADMIN,NOTIFY",
    "accessTokenValiditySeconds": 7200,
    "refreshTokenValiditySeconds": null,
    "additionalInformation": "",
    "scope": "user:read",
    "authorizedGrantTypes": "password",
    "registeredRedirectUri": null,
    "scoped": true,
    "secretRequired": true
}
```

DELETE  /client/{app_id}
```
/client/crudapp
```


## User

GET     /user
```json
[
    {
        "id": "5c4fc92905d5725d113b95b7",
        "authorities": [
            {
                "authority": "SA"
            }
        ],
        "password": "{pbkdf2}9e89ed6747025ef25cb1868e48e5011ea40e28535cde36cc523245eaa75e36db2dc7a4a685b9ec9e",
        "username": "james",
        "enabled": true,
        "accountNonExpired": true,
        "accountNonLocked": true,
        "credentialsNonExpired": true
    },
    {
        "id": "5c591f7e171a310e8f706820",
        "authorities": [
            {
                "authority": "ADMIN"
            }
        ],
        "password": "{pbkdf2}afa9df050f89762f022b82d320b410f6f0dc519ea78db8206d12c5a67170f07dcd0744991a5caed4",
        "username": "tom",
        "enabled": true,
        "accountNonExpired": true,
        "accountNonLocked": true,
        "credentialsNonExpired": true
    }
]
```

POST    /user
```json
{
    "authorities": "ADMIN,INOTIFY",
    "password": "123456",
    "username": "jack"
}
```

PUT     /user
```json
{
	"id": "5c5ba57ca4ca76380cea0a71",
    "authorities": "ADMIN",
    "password": "111111",
    "username": "jack"
}
```

DELETE  /user/{user_id}
```json
/user/5c5ba57ca4ca76380cea0a71
```
