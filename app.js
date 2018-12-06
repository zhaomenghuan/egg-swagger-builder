"use strict";

const swaggerLoader = require("./lib/swagger_loader");
const swaggerRule = require("./lib/swagger_rule");

// load all js files in app/apis/ directory automatically
module.exports = app => {
  app.beforeStart(async () => {
    const swagger = swaggerLoader(app);

    if (app.config.swaggerbuilder.enable) {
      app.get("/swagger-doc", ctx => {
        ctx.response.status = 200;
        ctx.response.type = "text/html";
        swagger.host = ctx.host;
        ctx.response.body = JSON.stringify(swagger);
      });
      app.logger.info("[egg-swagger-doc] register router: /swagger-doc");
    }

    app["rule"] = swaggerRule(swagger.definitions);
  });
};
