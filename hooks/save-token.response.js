const Helper = require('../lib/helper');

module.exports = (pluginName, storageService) =>
  ({ request, response }) => {
    const helper = new Helper({ pluginName, request, response });

    if (helper.href().endsWith(helper.config.tokenEndpoint)) {
      const responseBody = helper.body();

      storageService.setToken(responseBody.access_token);
    }
  };