# OAuth 2 Header Hooks

This plugin will read some config from environment and use that to authenticate and automatically add Bearer token to all outgoing requests.

## Install

Install the `insomnia-plugin-oauth-header-hooks` plugin from Preferences > Plugins.

## Usage

Add configuration by setting OAUTH_HEADER_HOOKS environment variable.

```
{
	"OAUTH_HEADER_HOOKS": {
		"tokenEndpoint": "/oauth/token",
	}
}
```