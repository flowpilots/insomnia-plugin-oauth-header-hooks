const pluginName = '[oauth-header-hooks]';

const STORAGE = {
  access_token: undefined,

  setToken(token) {
    STORAGE.access_token = token;
    console.log(`${pluginName} access_token is set`);
  }
};

const Util = {
  getConfig(req) {
    const env = req.getEnvironment();
    const DEFAULT_CONFIG = {
      tokenEndpoint: '/oauth/token',
      exclude: [],
      oauthAutoCall: false,
      oauth: {},
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
  },

  performCall(req) {
    const {
      endpoint,
      client_id,
      client_secret,
      grant_type,
      scope,
    } = Util.getConfig(req).oauth;

    const body = [
      `client_id=${client_id}`,
      `client_secret=${client_secret}`,
      `grant_type=${grant_type}`,
      `scope=${scope}`,
    ].join('&');


    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          resolve(JSON.parse(xhr.responseText));
        }
      }

      xhr.open('POST', endpoint, true);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

      console.log(`${pluginName} Getting token from ${endpoint}`);
      xhr.send(body);
    });
  },

  setHeader(req) {
    console.log(`${pluginName} Authorization header added to ${req.getMethod().toUpperCase()} ${Util.href(req)}`);
    req.setHeader('Authorization', `Bearer ${STORAGE.access_token}`);
  }
}

const requestHook = async ({ app, request }) => {
  const config = Util.getConfig(request);
  const excludes = [...config.exclude, config.tokenEndpoint];

  if (!Util.excludeUrl(request, excludes)) {
    if (STORAGE.access_token) {
      Util.setHeader(request);
    } else {
      if (config.oauthAutoCall) {
        const response = await Util.performCall(request);
        STORAGE.setToken(response.access_token);
        Util.setHeader(request);
      } else {
        app.alert('No Token Available', `please run ${config.tokenEndpoint} first'`);
      }
    }
  }
};

const saveTokenFromResponse = ({ request, response }) => {
  const config = Util.getConfig(request);

  if (Util.href(request).endsWith(config.tokenEndpoint)) {
    const responseContent = Util.getBody(response);

    STORAGE.setToken(responseContent.access_token);
  }
};

module.exports = {
  requestHooks: [requestHook],
  responseHooks: [saveTokenFromResponse],
  templateTags: [],
};