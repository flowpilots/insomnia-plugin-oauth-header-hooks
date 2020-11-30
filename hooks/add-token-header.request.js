const Helper = require('../lib/helper');

module.exports = (pluginName, storageService, oAuth2Service) =>
  async ({ app, request }) => {
    const helper = new Helper({ pluginName, request });

    if (!helper.excludeUrl()) {
      if (storageService.getToken()) {
        helper.setHeader(storageService.getToken());
      } else {
        if (helper.config.oauthAutoCall) {
          const responseBody = await oAuth2Service.getToken(helper.config.oauth);

          storageService.setToken(responseBody.access_token);

          helper.setHeader(storageService.getToken());
        } else {
          app.alert('No Token Available', `please run ${helper.config.tokenEndpoint} first'`);
        }
      }
    }
  };