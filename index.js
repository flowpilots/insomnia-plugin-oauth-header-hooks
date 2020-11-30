const OAuth2Service = require('./lib/oauth2.service');
const StorageService = require('./lib/storage.service');

const pluginName = '[oauth-header-hooks]';

const storageService = new StorageService(pluginName);
const oAuth2Service = new OAuth2Service(pluginName);

module.exports = {
  requestHooks: [
    require('./hooks/add-token-header.request')(pluginName, storageService, oAuth2Service),
  ],
  responseHooks: [
    require('./hooks/save-token.response')(pluginName, storageService),
  ],
  templateTags: [],
};