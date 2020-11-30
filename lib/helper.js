module.exports = class Helper {
  constructor(params) {
    this.pluginName = params.pluginName;
    this.req = params.request;
    this.res = params.response;

    this.config = this.getConfig();
  }

  getConfig() {
    const env = this.req.getEnvironment();
    const DEFAULT_CONFIG = {
      tokenEndpoint: '/oauth/token',
      exclude: [],
      oauthAutoCall: false,
      oauth: {},
    };

    return { ...DEFAULT_CONFIG, ...env.OAUTH_HEADER_HOOKS_CONFIG };
  }

  href() {
    const requestURI = new URL(this.req.getUrl());
    return requestURI.href;
  }

  body() {
    const responseBody = this.res.getBody();
    return JSON.parse(responseBody.toString('utf-8'));
  }

  excludeUrl() {
    const url = this.href();
    const method = this.req.getMethod().toUpperCase();
    const excludes = [...this.config.exclude, this.config.tokenEndpoint];

    for (let i = 0, max = excludes.length; i < max; i++) {
      const endpoint = excludes[i];

      if (
        endpoint.url && endpoint.method
        && url.endsWith(endpoint.url)
        && endpoint.method.toUpperCase() === method
        || url.endsWith(endpoint)
      ) {
        return true;
      }
    }
    return false;
  }

  setHeader(accessToken) {
    console.log(`${this.pluginName} Authorization header added to ${this.req.getMethod().toUpperCase()} ${this.href()}`);
    this.req.setHeader('Authorization', `Bearer ${accessToken}`);
  }
}