# og-sdk

This SDK set of libraries could be used to interact with APIS.

### Nuxt settings

Use the following keys to replace settings in
the behavior of SDK.

```js
// nuxt.config.js
{
  publicRuntimeConfig: {
      // Og SDK settings
      og: {

        // Indicate we should use cookie credentials
        API_CREDENTIALS: true,

        // The main URL where SDK will request
        API_URL: "http://api.example.com/",

        // The path in the API where to POST login information.
        AUTH_API_PATH_LOGIN: 'login',

        // The path in the API where to GET the user information.
        AUTH_API_PATH_USER: 'users/current',

        AUTH_USER_RESOURCE: OgResource,

        API_HEADERS: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
    }
}
```
