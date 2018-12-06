const path = require("path");
const fs = require("fs");

module.exports = app => {
  app.beforeStart(async () => {
    app.get("/swagger-ui.html", ctx => {
      let swaggerPath = path.join(__dirname, "/app/public/index.html");
      ctx.response.status = 200;
      ctx.response.type = "text/html";
      ctx.response.body = fs.readFileSync(swaggerPath).toString();
    });
    app.logger.info("[egg-swagger-doc] register router: /swagger-ui.html");
  });
};
