# Gulp自动化构建工作流封装

## 初始化项目

使用`zce-cli`脚手架工具

- `yarn global add zce-cli`
- `zce init nm zyd-pages` nm是node模块

# zyd-pages

[![NPM Downloads][downloads-image]][downloads-url]
[![NPM Version][version-image]][version-url]
[![License][license-image]][license-url]
[![Dependency Status][dependency-image]][dependency-url]
[![devDependency Status][devdependency-image]][devdependency-url]
[![Code Style][style-image]][style-url]

> static web app workflow

## Installation

```shell
$ yarn add zyd-pages

# or npm
$ npm install zyd-pages
```

## Usage

<!-- TODO: Introduction of API use -->

```javascript
const zydPages = require('zyd-pages')
const result = zydPages('zce')
// result => 'zce@zce.me'
```

## API

<!-- TODO: Introduction of API -->

### zydPages(name[, options])

#### name

- Type: `string`
- Details: name string

#### options

##### host

- Type: `string`
- Details: host string
- Default: `'zce.me'`

## Contributing

1. **Fork** it on GitHub!
2. **Clone** the fork to your own machine.
3. **Checkout** your feature branch: `git checkout -b my-awesome-feature`
4. **Commit** your changes to your own branch: `git commit -am 'Add some feature'`
5. **Push** your work back up to your fork: `git push -u origin my-awesome-feature`
6. Submit a **Pull Request** so that we can review your changes.

> **NOTE**: Be sure to merge the latest from "upstream" before making a pull request!

## License

[MIT](LICENSE) &copy; zyd <363797271>



[downloads-image]: https://img.shields.io/npm/dm/zyd-pages.svg
[downloads-url]: https://npmjs.org/package/zyd-pages
[version-image]: https://img.shields.io/npm/v/zyd-pages.svg
[version-url]: https://npmjs.org/package/zyd-pages
[license-image]: https://img.shields.io/github/license/363797271/zyd-pages.svg
[license-url]: https://github.com/363797271/zyd-pages/blob/master/LICENSE
[dependency-image]: https://img.shields.io/david/363797271/zyd-pages.svg
[dependency-url]: https://david-dm.org/363797271/zyd-pages
[devdependency-image]: https://img.shields.io/david/dev/363797271/zyd-pages.svg
[devdependency-url]: https://david-dm.org/363797271/zyd-pages?type=dev
[style-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[style-url]: https://standardjs.com
