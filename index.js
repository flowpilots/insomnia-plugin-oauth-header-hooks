// For help writing plugins, visit the documentation to get started:
//   https://support.insomnia.rest/article/26-plugins

const STORAGE = {
  access_token: undefined,
};

const Util = {
  getConfig(req) {
    const env = req.getEnvironment();
    const DEFAULT_CONFIG = {
      tokenEndpoint: '/oauth/token',
      exclude: [],
    };

    return { ...DEFAULT_CONFIG, ...env.OAUTH_HEADER_HOOKS_CONFIG };
  },

  href(req) {
    const requestURI = new URL(req.getUrl());
    return requestURI.href;
  },

  getBody(res) {
    const responseBody = res.getBody();
    return JSON.parse(responseBody.toString('utf-8'));
  },

  excludeUrl(req, endpoints) {
    const url = Util.href(req);
    const method = req.getMethod().toUpperCase();

    for (let i = 0, max = endpoints.length; i < max; i++) {
      const endpoint = endpoints[i];

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
}

const requestHook = function ({ app, request }) {
  const config = Util.getConfig(request);
  const excludes = [...config.exclude, config.tokenEndpoint];

  if (!Util.excludeUrl(request, excludes)) {
    if (STORAGE.access_token) {
      request.setHeader('Authorization', `Bearer ${STORAGE.access_token}`);
    } else {
      app.alert('No Token Available', `please run ${config.tokenEndpoint} first'`);
      // TODO:
      // v1.1 perform the call self instead of showing alert
      // v1.2 perform the call if { "OAUTH_HEADER_HOOKS_CONFIG.performCall": true }
    }
  }
}

const saveTokenFromResponse = function ({ request, response }) {
  const config = Util.getConfig(request);

  if (Util.href(request).endsWith(config.tokenEndpoint)) {
    const responseContent = Util.getBody(response);

    STORAGE.access_token = responseContent.access_token;
  }
}

module.exports = {
  requestHooks: [requestHook],
  responseHooks: [saveTokenFromResponse],
  templateTags: [],
};