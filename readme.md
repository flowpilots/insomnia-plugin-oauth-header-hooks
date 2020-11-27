# OAuth 2 Header Hooks

This plugin will read some config from environment and use that to authenticate and automatically add Bearer token to all outgoing requests.

## Install

Install the `insomnia-plugin-oauth-header-hooks` plugin from Preferences > Plugins.

## Usage

Add configuration by setting OAUTH_HEADER_HOOKS_CONFIG environment variable.

```
{
  "OAUTH_HEADER_HOOKS_CONFIG": {
    "tokenEndpoint": "/oauth/token", // this is the token endpoint which is going to be called to retrieve token
    "exclude": [ // endpoints in this list will be ignored. So the plugin will not add the header on them
      "/public-accesible-endpoint",
      {url: "/another-publicly-available-url", method: "post"}
    ],
    "oauthAutoCall": true // setting this to true will call the tokenEndpoint if it isn't called upfront,
    "oauth": { // contains the object to make the call
      "endpoint": "http://api.com/oauth/token",
      "client_id": "123",
      "client_secret": "s3cr3t",
      "grant_type": "client_credentials",
      "scope": "users moderator dashboard",
    }
  }
}
```