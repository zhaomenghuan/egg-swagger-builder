# egg-swagger-builder

通过注释块中的 Swagger 语法标签生成 swagger.json，从而支持 swagger-ui 加载预览。

## Install

```bash
$ npm i egg-swagger-builder --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.swaggerbuilder = {
  enable: true,
  package: "egg-swagger-builder"
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.swaggerbuilder = {
  dirScanner: "./app/controller",
  apiInfo: {
    title: "egg-swagger",
    description: "swagger-ui for egg",
    version: "1.0.0"
  },
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  enable: true
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Introduce

完成插件引入之后，如果不修改默认配置，应用启动后，会自动扫描 app/controller 和 app/contract 下的文件。controller 下的文件先不做描述。contract 下的文件为定义好的请求体和响应体。

## @Controller

格式：@Controller {ControllerName}

a.如果文件第一个注释块中存在标签@Controller，应用会扫描当前文件下的所有注释块，否则扫描将会跳过该文件。
b.如果不标示 ControllerName，程序会将当前文件的文件名作为 ControllerName。

例：

```js
/**
 * @Controller user
 */
class UserController extends Controller {
  //some method
}
```

## @Router

格式：@Router {Mothod} {Path}

    a.Mothod,请求的方法(post/get/put/delete等)，不区分大小写。
    b.Path,请求的路由。

## @Request

格式：@Request {Position} {Type} {Name} {Description}

    a.position.参数的位置,该值可以是body/path/query/header/formData.
    b.Type.参数类型，body之外位置目前只支持基础类型,integer/string/boolean/number，及基础类型构成的数组，body中则支持contract中定义的类型。如果position是formData还将支持 file 类型
    c.Name.参数名称.如果参数名称以*开头则表示必要，否则非必要。
    d.Description.参数描述

## @Response

格式：@Response {HttpStatus} {Type} {Description}

    a.HttpStatus.Http状态码。
    b.Type.同Request中body位置的参数类型。
    d.Description.响应描述。

## @Deprecated

    如果注释块中包含此标识，则表示该注释块注明的接口，未完成或不启用。

## @Description

格式：@Description {Description}

    接口具体描述

## @Summary

格式：@Summary {Summary}

    接口信息小标题

例：

```js
/**
 * @Controller user
 */
class HomeController extends Controller {
  /**
   * @Router POST /user
   * @Request body createUser name description-createUser
   * @Request header string access_token
   * @Response 200 baseResponse ok
   */
  async index() {
    this.ctx.body = 'hi, ' + this.app.plugins.swagger.name;
  }
```

如果在 config 中开启并定义了 securityDefinitions,默认 enableSecurity 为 false.则可在注释块中加入@apikey，加入安全验证。也可定义成其他名字，只需@定义好的字段名就好。关于 securityDefinitions 的定义可以自行搜索。

```js
exports.swaggerbuilder = {
  securityDefinitions: {
    apikey: {
      type: "apiKey",
      name: "clientkey",
      in: "header"
    }
    // oauth2: {
    //   type: 'oauth2',
    //   tokenUrl: 'http://petstore.swagger.io/oauth/dialog',
    //   flow: 'password',
    //   scopes: {
    //     'write:access_token': 'write access_token',
    //     'read:access_token': 'read access_token',
    //   },
    // },
  },
  enableSecurity: true
};
```

## contract 定义

关于 Contract 的定义其实在测试代码里面，已经把支持的所有情况都定义出来了。详见[here](test/fixtures/apps/swagger-doc-test/app/contract/request/resource.js),这里我简单说明一下，以下是测试代码中的部分 contract。

```js
module.exports = {
  createResource: {
    resourceId: { type: "string", required: true, example: "1" },
    resourceNametrue: { type: "string", required: true },
    resourceType: {
      type: "string",
      required: true,
      enum: ["video", "game", "image"]
    },
    resourceTag: { type: "array", itemType: "string" },
    owner: { type: "User", required: true },
    owners: { type: "array", itemType: "User" }
  }
};
```

@基础类型

```js
module.exports = {
  Model名称:{
    字段名称: { type: 字段类型，required: 字段必要性, example: 示例}
  }
}
```

注：type 可以是 array 之外的类型，包括自定义的类型，目前自定义类型不支持 example

---

@ENUM

```js
module.exports = {
  Model名称:{
    字段名称: { type: 字段类型，required: 字段必要性, enum:[]}
  }
}
```

注: type 只能是 string 或 number，enum 为具体的数值组成的集合

---

@ARRAY

```js
module.exports = {
  Model名称:{
    字段名称: { type: "array"，required: 字段必要性, itemType:数组元素类型}
  }
}
```

type 为 array,itemType 为具体的数组元素类型，支持自定义类型。

---

@自定义类型

关于自定义类型，必须定义在 contract 目录下，在 contract 下的其他类型中使用时，直接使用 Model 名称引入。

---

因为 contract 的定义和 validate-rule 的定义具有极大的相似性，所以目前的版本中定义 contract 的同时会简单的生成相应的 validate-rule.具体的使用'ctx.rule.'加 Model 名称直接引入。

上面的 model，在做验证的时候就可以使用如下的方式(需使用 egg-validate)

```js
ctx.validate(ctx.rule.createResource, ctx.request.body);
```

## Questions & Suggestions

Please open an issue [here](https://github.com/Ysj291823/egg-swagger-doc/issues).

## License

[MIT](LICENSE)
