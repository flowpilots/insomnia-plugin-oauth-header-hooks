module.exports = class StorageService {
  constructor(pluginName) {
    this.access_token = undefined;
    this.pluginName = pluginName;
  }

  hasToken() {
    return !!this.access_token;
  }

  setToken(token) {
    this.access_token = token;
    console.log(`${this.pluginName} access_token is set`);
  }

  getToken() {
    return this.access_token;
  }
}