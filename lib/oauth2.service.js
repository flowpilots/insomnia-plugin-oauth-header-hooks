module.exports = class OAuth2Service {
  constructor(pluginName) {
    this.pluginName = pluginName;
  }

  getToken(config) {
    const {
      endpoint,
      client_id,
      client_secret,
      grant_type,
      scope,
    } = config;

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

      console.log(`${this.pluginName} Getting token from ${endpoint}`);
      xhr.send(body);
    });
  }
}