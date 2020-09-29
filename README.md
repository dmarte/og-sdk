# OgSDK

This SDK set of libraries could be used to interact with APIS.

### Nuxt settings

Use the following keys to replace settings in
the behavior of SDK.

#### Settings example for `og.config.js`
```js
// og.config.js
export default {
  // The current app URL
  APP_URL: process.env.APP_URL || process.env.BASE_URL,
  API_URL: process.env.OG_SDK_URL_API,
  API_HEADERS: {},
  // Indicate if we need to include some credentials
  // when we made api requests.
  API_CREDENTIALS: true,
  ALLOWED_COUNTRIES: ['DO', 'US', 'CA', 'MX'],
  ALLOWED_CURRENCIES: ['DOP', 'USD'],
  // Paths to request to the API for the POST login information
  // Also to request the user logged information.
  AUTH_API_PATH_LOGIN: '/auth/login',
  AUTH_API_PATH_USER: '/auth/user',
  // Route paths used to redirect the user when protected route
  // Or when not protected route.
  AUTH_WEB_HOME: '/', // When not protected
  AUTH_WEB_LOGIN: '/auth/login', // When protected
  // This option let you set the main user resource class.
  AUTH_USER_RESOURCE: OgoUserResource,
  // The name of the key on session for the token and user
  // Don't touch this if you're not sure how it works.
  // It may do the auth library not to work as expected.
  AUTH_SESSION_KEY_TOKEN: 'auth.token',
  AUTH_SESSION_KEY_USER: 'auth.user',
  // Collections, default number of results per page.
  COLLECTION_PER_PAGE: 15
}
```

### Using the middleware
To use the built-in middleware of OgSDK you will need to follow two steps.

*1. Create a middleware in you `middleware` nuxt folder.*

```js
// Location: [root]/middleware/auth.js
import Middleware from '[sdk_path]/src/nuxt/middleware'

export default Middleware

```
*2. Add the middleware in your `nuxt.config.js`*
```js
// Location: [root]/nuxt.config.js
export default {
  router: {
    middleware: ['auth']
  }
}
```
