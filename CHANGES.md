# Unreleased (in `master`)

## Breaking Changes

- Updated to Webpack 5 and updated all plugins and loaders - custom configuration for any of these could now be invalid.

- Dropped use of PhantomJS - the default browser for Karma testing is now `ChromeHeadless` and Chrome must be available wherever tests are going to be run.

## Changes

- Updated to Babel 7.13
- Updated to Karma 6 and Mocha 8

## Dependencies

### Added

- css-minimizer-webpack-plugin v2.0.0
- postcss v8.2.13

### Changed

- @babel/cli: v7.10.3 → v7.13.16
- @babel/core: v7.10.3 → v7.14.0
- @babel/plugin-syntax-jsx: v7.10.1 → v7.12.13
- @babel/plugin-transform-react-constant-elements: v7.10.1 → v7.13.13
- @babel/plugin-transform-react-jsx: v7.10.3 → v7.13.12
- @babel/plugin-transform-runtime: v7.10.3 → v7.13.15
- @babel/preset-env: v7.10.3 → v7.14.0
- @babel/preset-react: v7.10.1 → v7.13.13
- @babel/runtime: v7.10.3 → v7.14.0
- @pmmmwh/react-refresh-webpack-plugin: v0.3.3 → v0.4.3
- autoprefixer: v9.8.4 → v10.2.5
- babel-loader: v8.1.0 → v8.2.2
- babel-plugin-add-module-exports: v1.0.2 → v1.0.4
- babel-plugin-inferno: v6.1.1 → v6.2.0
- babel-preset-proposals: v0.3.0 → v0.4.0
- case-sensitive-paths-webpack-plugin: v2.3.0 → v2.4.0
- copy-webpack-plugin: v6.0.2 → v8.1.1
- cross-env: v7.0.2 → v7.0.3
- css-loader: v3.6.0 → v5.2.4
- debug: v4.1.1 → v4.3.1
- file-loader: v6.0.0 → v6.2.0
- fs-extra: v9.0.1 → v9.1.0
- gzip-size: v5.1.1 → v6.0.0
- html-webpack-plugin: v4.3.0 → v5.3.1
- inquirer: v7.2.0 → v8.0.0
- karma: v5.1.0 → v6.3.2
- karma-coverage: v2.0.2 → v2.0.3
- karma-sourcemap-loader: v0.3.7 → v0.3.8
- karma-webpack: v4.0.2 → v5.0.0
- mini-css-extract-plugin: v0.9.0 → v1.4.0
- minimist: v1.2.5 → v1.2.6
- mocha: v7.1.2 → v8.3.2
- open: v7.0.4 → v8.0.7
- ora: v4.0.4 → v5.4.0
- postcss-loader: v3.0.0 → v5.2.0
- react-refresh: v0.8.3 → v0.10.0
- resolve: v1.17.0 → v1.20.0
- run-series: v1.1.8 → v1.1.9
- semver: v7.3.2 → v7.3.5
- style-loader: v1.2.1 → v2.0.0
- terser-webpack-plugin: v3.0.6 → v5.1.1
- url-loader: v4.1.0 → v4.1.1
- webpack: v4.43.0 → v5.36.1
- webpack-dev-middleware: v3.7.2 → v4.1.0
- webpack-dev-server: v3.11.0 → v3.11.2

### Removed

- @babel/plugin-proposal-optional-chaining (only used to avoid a Webpack 4 parser bug)
- @babel/plugin-proposal-nullish-coalescing-operator (only used to avoid a Webpack 4 parser bug)
- @babel/polyfill (no longer required for PhantomJS)
- babel-plugin-transform-decorators-legacy (obsolete, was no longer being used)
- karma-phantomjs-launcher (dropped PhantomJS)
- optimize-css-assets-webpack-plugin (replaced by css-minimizer-webpack-plugin)
- phantomjs-prebuilt (dropped PhantomJS)

# 0.25.2 / 2020-05-20

## Fixed

- Bumped Node.js version in templates.

# 0.25.1 / 2020-05-20

## Changed

- Don't include `docs/` in the npm package.

# 0.25.0 / 2020-05-20

## Breaking Changes

- Node.js 8 is no longer supported; Node.js 10.13.0 is now the minimum required version, as per many of nwb's dependencies.

**Browser Support**

- Removed default polyfills for `Promise`, `fetch()` and `Object.assign()` and deprecated `polyfill` config.

  If you need to support older browsers, you will now need to include the necessary polyfills in your app - see the new [Browser Support docs](https://github.com/insin/nwb/blob/master/docs/BrowserSupport.md#browser-support) for details on polyfilling and suggested modules which provide them.

  If this change affects your app, a quick fix is to use [react-app-polyfill](https://github.com/facebook/create-react-app/tree/master/packages/react-app-polyfill)'s IE11 polyfill, which is equivalent to what nwb's default polyfill used to be:

  ```js
  import 'react-app-polyfill/ie11'
  ```

- For apps and quick commands, `@babel/preset-env` is now configured to [only transpile the necessary ECMAScript 2015+ for supported browsers](https://github.com/insin/nwb/blob/master/docs/BrowserSupport.md#default-browser-support).

  When running a development server, this defaults to the most recent version of Chrome, Firefox or Safari, so you _may_ need to adjust [`browsers.development` config](https://github.com/insin/nwb/blob/master/docs/Configuration.md#browsers-string--arraystring--object) if you're using an out of date browser and you **will** need to adjust it if you're developing with an older browser supported by your app.

- Default browser configuration for Autoprefixer when building an app has changed from [`>1%, last 4 versions, Firefox ESR, not ie < 9`](https://browserl.ist/?q=%3E1%25%2C+last+4+versions%2C+Firefox+ESR%2C+not+ie+%3C+9) to [`>0.2%, not dead, not op_mini all`](https://browserl.ist/?q=%3E0.2%25%2C+not+dead%2C+not+op_mini+all).

  When running a development server, the default browser configuration has changed to [`last 1 chrome version, last 1 firefox version, last 1 safari version`](https://browserl.ist/?q=last+1+chrome+version%2C+last+1+firefox+version%2C+last+1+safari+version).

**Configuration**

- Deprecated using a string for [`webpack.autoprefixer` config](https://github.com/insin/nwb/blob/master/docs/Configuration.md#autoprefixer-object) to configure supported browsers - this will no longer do anything and should be moved to the new [`browsers` config](https://github.com/insin/nwb/blob/master/docs/Configuration.md#browsers-string--arraystring--object).
- Removed support for `babel.stage` and `webpack.uglify` config deprecated in nwb v0.24.0.
- copy-webpack-plugin v6.0.0 [has breaking changes to its options](https://github.com/webpack-contrib/copy-webpack-plugin/blob/master/CHANGELOG.md#600-2020-05-15) which you should read if you're using [`webpack.copy` config](https://github.com/insin/nwb/blob/master/docs/Configuration.md#copy-array--object).

  In particular, the `ignore` option in a copy pattern must now be put inside the new `globOptions` option.

**Dependencies**

- file-loader v6.0.0 [changed its default hashing algorithm](https://github.com/webpack-contrib/file-loader/blob/master/CHANGELOG.md#600-2020-03-17) so hashes in output filenames will change after updating to this release, even if their contents haven't changed.

## Added

- Added top-level [`browsers` config](https://github.com/insin/nwb/blob/master/docs/Configuration.md#browsers-string--arraystring--object) to configure supported browsers. This supports using separate browserslist queries for development and production.
- Added [Browser Support docs](https://github.com/insin/nwb/blob/master/docs/BrowserSupport.md#browser-support), with a section on [polyfilling missing language features](https://github.com/insin/nwb/blob/master/docs/BrowserSupport.md#polyfilling-missing-language-features).

## Dependencies

- autoprefixer: v9.7.6 → [v9.8.0](https://github.com/postcss/autoprefixer/blob/master/CHANGELOG.md#980)
- chalk: v3.0.0 → [v4.0.0](https://github.com/chalk/chalk/releases/tag/v4.0.0)
- copy-webpack-plugin: v5.1.1 → [v6.0.1](https://github.com/webpack-contrib/copy-webpack-plugin/blob/master/CHANGELOG.md#601-2020-05-16)
- file-loader: v4.3.0 → [v6.0.0](https://github.com/webpack-contrib/file-loader/blob/master/CHANGELOG.md#600-2020-03-17)
- fs-extra: v8.1.0 → [v9.0.0](https://github.com/jprichardson/node-fs-extra/blob/master/CHANGELOG.md#900--2020-03-19)
- karma: v4.4.1 → [v5.0.9](https://github.com/karma-runner/karma/blob/master/CHANGELOG.md#509-2020-05-19)
- karma-mocha: v1.3.0 → [v2.0.1](https://github.com/karma-runner/karma-mocha/blob/master/CHANGELOG.md#201-2020-04-29)
- terser-webpack-plugin v2.3.6 → [v3.0.1](https://github.com/webpack-contrib/terser-webpack-plugin/blob/master/CHANGELOG.md#301-2020-05-06)
- url-loader: v2.3.0→ [v4.1.0](https://github.com/webpack-contrib/url-loader/blob/master/CHANGELOG.md)

# 0.24.7 / 2020-05-16

## Fixed

- Fixed inclusion of `__source` and `__self` debugging information when transpiling JSX in `react-component` projects by defaulting `process.env.NODE_ENV` to `'production'` when building.

## Dependencies

- open: v7.0.3 → [v7.0.4](https://github.com/sindresorhus/open/releases/tag/v7.0.4)

# 0.24.6 / 2020-05-12

## Dependencies

- @babel/core: v7.90 → [v7.9.6](https://github.com/babel/babel/blob/master/CHANGELOG.md#v796-2020-04-29)
- @babel/plugin-transform-runtime: v7.9.0 → [v7.9.6](https://github.com/babel/babel/blob/master/CHANGELOG.md#v796-2020-04-29)
- @babel/preset-env: v7.9.0 → [v7.9.6](https://github.com/babel/babel/blob/master/CHANGELOG.md#v796-2020-04-29)
- @babel/runtime: v7.9.2 → [v7.9.6](https://github.com/babel/babel/blob/master/CHANGELOG.md#v796-2020-04-29)
- @pmmmwh/react-refresh-webpack-plugin: v0.2.0 → [v0.3.1](https://github.com/pmmmwh/react-refresh-webpack-plugin/blob/master/CHANGELOG.md#031-11-may-2020)
- autoprefixer: v9.7.5 → [v9.7.6](https://github.com/postcss/autoprefixer/blob/master/CHANGELOG.md#976)
- cross-spawn: v7.0.1 → [v7.0.2](https://github.com/moxystudio/node-cross-spawn/blob/master/CHANGELOG.md#702-2020-04-04)
- css-loader: v3.4.2 → [v3.5.3](https://github.com/webpack-contrib/css-loader/blob/master/CHANGELOG.md#353-2020-04-24)
- html-webpack-plugin: v3.2.0 → [v4.3.0](https://github.com/jantimon/html-webpack-plugin/blob/master/CHANGELOG.md#430-2020-04-30)
- karma-coverage: v2.0.1 → [v2.0.2](https://github.com/karma-runner/karma-coverage/blob/master/CHANGELOG.md#202-2020-04-13)
- mocha: v7.1.1 → [v7.1.2](https://github.com/mochajs/mocha/blob/master/CHANGELOG.md#712--2020-04-26)
- ora: v4.0.3 → [v4.0.4](https://github.com/sindresorhus/ora/compare/v4.0.3...v4.0.4)
- react-refresh: v0.8.1 → [v0.8.2](https://github.com/facebook/react/commits/9491f394723e140259d65f4d2b8a4d869fa4ba62/packages/react-refresh)
- resolve: v1.15.1 → [v1.17.0](https://github.com/browserify/resolve/compare/v1.15.1...v1.17.0)
- semver: v7.1.3 → [v7.3.2](https://github.com/npm/node-semver/compare/v7.1.3...v7.3.2)
- style-loader: v1.1.3 → [v1.2.1](https://github.com/webpack-contrib/style-loader/blob/master/CHANGELOG.md#121-2020-04-28)
- terser-webpack-plugin v2.3.5 → [v2.3.6](https://github.com/webpack-contrib/terser-webpack-plugin/blob/master/CHANGELOG.md#236-2020-04-25)
- webpack: v4.42.1 → [v4.43.0](https://github.com/webpack/webpack/releases/tag/v4.43.0)
- webpack-dev-server: v3.10.3 → [v3.11.0](https://github.com/webpack/webpack-dev-server/blob/master/CHANGELOG.md#3110-2020-05-08)

# 0.24.5 / 2020-03-24

## Changed

- [html-webpack-plugin got a major version bump to v4](https://dev.to/jantimon/html-webpack-plugin-4-has-been-released-125d)
  - Output HTML is now minified by default - you can disable this by configuring `html.minification = false`.
  - Chunk sorting was removed, but it seems to work as before for the ordering of the JavaScript files generated by nwb's build.
  - The plugin nwb uses to inline the webpack runtime chunk was rewritten to use v4's new hooks.

## Fixed

- The `lang` attribute on `<html>` wasn't getting set to the default `'en'` when using the `nwb react`, `nwb preact` and `nwb inferno` quick development commands.

## Dependencies

- @babel/plugin-transform-react-jsx: v7.9.1 → [v7.9.4](https://github.com/babel/babel/releases/tag/v7.9.4)
- @babel/preset-react: v7.9.1 → [v7.9.4](https://github.com/babel/babel/releases/tag/v7.9.4)
- @babel/runtime: v7.9.0 → v7.9.2
- autoprefixer: v9.7.4 → [v9.7.5](https://github.com/postcss/autoprefixer/blob/master/CHANGELOG.md#975)
- html-webpack-plugin: v3.2.0 → [v4.0.1](https://github.com/jantimon/html-webpack-plugin/blob/master/CHANGELOG.md#401-2020-03-23)
- webpack: v4.42.0 → [v4.42.1](https://github.com/webpack/webpack/releases/tag/v4.42.1)

# 0.24.4 / 2020-03-21

## Added

- Added [`babel.react` config](https://github.com/insin/nwb/blob/master/docs/Configuration.md#react-string--object) to configure `@babel/preset-react` options, allowing you to opt-in to using the [new `automatic` runtime](https://reactjs.org/blog/2019/10/22/react-release-channels.html#experimental-channel) which was added in Babel v7.9.0.

  For convenience, you can just configure the runtime name if you want to try it with the [experimental version of React](https://reactjs.org/blog/2019/10/22/react-release-channels.html#experimental-channel):

  ```js
  module.exports = {
    babel: {
      react: 'automatic'
    }
  }
  ```

## Changed

- Updated to [Babel v7.9.0](https://babeljs.io/blog/2020/03/16/7.9.0).
- Validate that the entry module for quick commands (e.g. `nwb react run SomeComponent.js`) exists, to avoid a confusing error message [[#441](https://github.com/insin/nwb/issues/441)]

## Dependencies

- @babel/core: v7.8.7 → v7.9.0
- @babel/plugin-transform-react-constant-elements: v7.8.3 → v7.9.0
- @babel/plugin-transform-react-jsx: v7.8.3 → v7.9.1
- @babel/plugin-transform-runtime: v7.8.3 → v7.9.0
- @babel/preset-env: v7.8.7 → v7.9.0
- @babel/preset-react: v7.8.3 → v7.9.1
- @babel/runtime: v7.8.7 → v7.9.0
- babel-loader: v8.0.6 → [v8.1.0](https://github.com/babel/babel-loader/releases/tag/v8.1.0)
- mocha: v7.1.0 → [v7.1.1](https://github.com/mochajs/mocha/blob/master/CHANGELOG.md#711--2020-03-18)
- react-refresh: v0.8.0 → v0.8.1

# 0.24.3 / 2020-03-14

## Changed

- Added a temporary hack to bypass [startup info logging](https://github.com/webpack/webpack-dev-server/blob/50c09a4b64c013cca0acb6013bdaa28d0f342149/lib/utils/status.js#L9-L16) Webpack Dev Server currently does even when its `quiet` option is set.
- CSS minification hasn't been enabled since nwb v0.23.0 as css-loader v1.0.0 stopped doing it by default - re-enable it using [Optimize CSS Assets Webpack Plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin) [[#467](https://github.com/insin/nwb/issues/467)]

## Dependencies

- minimist v1.2.4 → v1.2.5
- optimize-css-assets-webpack-plugin v5.0.3

# 0.24.2 / 2020-03-12

## Fixed

- Fixed copying of co-located `.test.js`/`.spec.js` files when building a React component or web module by also passing the new `--no-copy-ignored` flag when calling @babel/cli [[#529](https://github.com/insin/nwb/issues/529)]

## Dependencies

- inquirer: v7.0.6 → [v7.1.0](https://github.com/SBoudrias/Inquirer.js/compare/inquirer@7.0.6...inquirer@7.1.0)
- minimist v1.2.0 → [v1.2.4](https://github.com/substack/minimist/compare/1.2.0...1.2.4) - security fix
- open: v7.0.2 → [v7.0.3](https://github.com/sindresorhus/open/releases/tag/v7.0.3)

# 0.24.1 / 2020-03-11

## Fixed

- Fixed serving the demo app for a React component [[#542](https://github.com/insin/nwb/pull/542)]
- Fixed Fast Refresh for the default React component demo app by exporting the `Demo` component in the template.

# 0.24.0 / 2020-03-08 ♀️

## Breaking Changes

- Node.js 6 is no longer supported; Node.js 8.9.0 is now the minimum required version, as per many of nwb's dependencies.

- Updated to [Babel 7](https://babeljs.io/blog/2018/08/27/7.0.0)
  - [`babel.runtime` config](https://github.com/insin/nwb/blob/master/docs/Configuration.md#runtime-object--false) no longer accepts a `String` to enable an additional, named feature.

    Pass an `Object` with plugin options instead.

  - Support for tests in `*-test.js` files has been removed, as `@babel-core` no longer supports pattern matching them to ignore them when co-located in `src/`.

    Rename these to `*.test.js` instead.

- Dropped support for the old `--no-hmre` alias to disable Hot Module Replacement, just use `--no-hmr`  instead.

- Updated Preact config for [Preact X](https://preactjs.com/guide/v10/whats-new).

- Dependencies with (documented) breaking changes:
  - [copy-webpack-plugin@5.0.0](https://github.com/webpack-contrib/copy-webpack-plugin/blob/master/CHANGELOG.md#breaking-changes)
  - [css-loader@3.0.0](https://github.com/webpack-contrib/css-loader/blob/master/CHANGELOG.md#breaking-changes)
  - [file-loader@4.0.0](https://github.com/webpack-contrib/file-loader/blob/master/CHANGELOG.md#400-2019-06-05)
  - [karma@4.0.0](https://github.com/karma-runner/karma/releases/tag/v4.0.0)
  - [mocha@6.0.0](https://github.com/mochajs/mocha/blob/master/CHANGELOG.md#boom-breaking-changes)

## Added

- Added [`babel.proposals` config](https://github.com/insin/nwb/blob/master/docs/Configuration.md#proposals-object--false) to configure use of Babel's proposal plugins.
- Added an `en` property to [`webpack.html` config](https://github.com/insin/nwb/blob/master/docs/Configuration.md#html-object) to set the document language when using nwb's default HTML template [[#520](https://github.com/insin/nwb/pull/520)] [[Muhnad][Muhnad]]

## Fixed

- Fix creation of an extra directory when creating a scoped component's UMD build [[#513](https://github.com/insin/nwb/issues/513)] [[rrapiteanu][rrapiteanu]]

## Changed

- [React Refresh Webpack Plugin](https://github.com/pmmmwh/react-refresh-webpack-plugin) is now used to enable [Fast Refresh](https://github.com/facebook/react/issues/16604#issuecomment-528663101) for React apps, as babel-plugin-react-transform is deprecated and doesn't support Babel 7.
- Replaced use of `UglifyJsPlugin` with `TerserWebpackPlugin`.
- React compatibility is now always configured for Preact apps, as `preact/compat` is now part of the `preact` module.

## Deprecated

- Deprecated `babel.stage` config, as Babel's `stage-X` presets were/are being removed in Babel 7 - if you provide it, nwb will warn you and enable Babel proposal plugins equivalent to the current stage they're at.

  Use [`babel.proposals` config](https://github.com/insin/nwb/blob/master/docs/Configuration.md#proposals-object--false) instead if you want to toggle some or all additional proposal plugins on.

- Deprecated `webpack.uglify` config, which has been renamed to [`webpack.terser`](https://github.com/insin/nwb/blob/master/docs/Configuration.md#terser-object--false).

- Autoprefixer renamed its `browsers` option to `overrideBrowserslist`, so you will get deprecation warnings if you were using `{browsers: ...}` in [`webpack.autoprefixer` config](https://github.com/insin/nwb/blob/master/docs/Configuration.md#autoprefixer-string--object).

## Dependencies

- autoprefixer: v9.0.2 → [v9.7.4](https://github.com/postcss/autoprefixer/blob/master/CHANGELOG.md#974)
- babel-plugin-add-module-exports: v0.2.1 → [v1.0.2](https://github.com/lijunle/babel-plugin-add-module-exports/releases/tag/v1.0.2)
- babel-plugin-inferno: v5.0.1 → [v5.1.0](https://github.com/infernojs/babel-plugin-inferno/releases)
- case-sensitive-paths-webpack-plugin: v2.1.2 → [v2.3.0](https://github.com/Urthen/case-sensitive-paths-webpack-plugin/blob/master/CHANGELOG.md#v230)
- chalk: v2.4.1 → [v3.0.0](https://github.com/chalk/chalk/releases/tag/v3.0.0)
- copy-webpack-plugin: v4.5.2 → [v5.1.1](https://github.com/webpack-contrib/copy-webpack-plugin/blob/master/CHANGELOG.md#511-2019-12-12)
- cross-spawn: v6.0.5 → [v7.0.1](https://github.com/moxystudio/node-cross-spawn/blob/master/CHANGELOG.md#701-2019-10-07)
- css-loader: v1.0.0 → [v3.4.2](https://github.com/webpack-contrib/css-loader/blob/master/CHANGELOG.md#342-2020-01-10)
- detect-port: v1.2.3 → [v1.3.0](https://github.com/node-modules/detect-port/releases)
- figures: v2.0.0 → v3.2.0
- filesize: v3.6.1 → [v6.1.0](https://github.com/avoidwork/filesize.js/blob/master/CHANGELOG.md#610)
- file-loader: v1.1.11 → [v4.3.0](https://github.com/webpack-contrib/file-loader/blob/master/CHANGELOG.md#430-2019-11-21)
- fs-extra: v7.0.0 → [v8.1.0](https://github.com/jprichardson/node-fs-extra/blob/master/CHANGELOG.md#810--2019-06-28)
- glob: v7.1.3 → [v7.1.6](https://github.com/isaacs/node-glob/compare/v7.1.3...v7.1.6)
- gzip-size: v5.0.0 → [v5.1.1](https://github.com/sindresorhus/gzip-size/compare/v5.0.0...v5.1.1)
- inquirer: v6.0.0 → [v7.0.6](https://github.com/SBoudrias/Inquirer.js/releases)
- karma: v2.0.0 → [v4.4.1](https://github.com/karma-runner/karma/blob/master/CHANGELOG.md#441-2019-10-18)
- karma-chrome-launcher: v2.2.0 → [v3.1.0](https://github.com/karma-runner/karma-chrome-launcher/blob/master/CHANGELOG.md#310-2019-08-13)
- karma-coverage: v1.1.2 → [v2.0.1](https://github.com/karma-runner/karma-coverage/blob/master/CHANGELOG.md#201-2019-08-20)
- karma-webpack: v3.0.0 → [v4.0.2](https://github.com/webpack-contrib/karma-webpack/blob/master/CHANGELOG.md#402-2019-06-08)
- mini-css-extract-plugin v0.4.1 → [v0.9.0](https://github.com/webpack-contrib/mini-css-extract-plugin/blob/master/CHANGELOG.md#090-2019-12-20)
- mocha: v5.2.0 → [v7.1.0](https://github.com/mochajs/mocha/blob/master/CHANGELOG.md#710--2020-02-26)
- opn: v5.3.0 → [open v7.0.2](https://github.com/sindresorhus/open/releases)
- ora: v3.0.0 → [v4.0.3](https://github.com/sindresorhus/ora/compare/v3.0.0...v4.0.3)
- postcss-loader: v2.1.6 → [v3.0.0](https://github.com/postcss/postcss-loader/blob/master/CHANGELOG.md#300-2018-08-08) - dropped Node.js 4 support
- promise: v8.0.1 → v8.1.0
- resolve: v1.8.1 → [v1.15.1](https://github.com/browserify/resolve/compare/v1.8.1...v1.15.1)
- semver: v5.5.1 → [v7.1.3](https://github.com/npm/node-semver/compare/v5.5.1...v7.1.3)
- style-loader: v0.21.0 → [v1.1.3](https://github.com/webpack-contrib/style-loader/blob/master/CHANGELOG.md#0231-2018-10-08)
- uglifyjs-webpack-plugin v1.2.7 → [terser-webpack-plugin v2.3.5](https://github.com/webpack-contrib/terser-webpack-plugin#readme)
- url-loader: v1.0.1 → [v2.3.0](https://github.com/webpack-contrib/url-loader/blob/master/CHANGELOG.md#230-2019-11-21)
- webpack: v4.16.4 → [v4.42.0](https://github.com/webpack/webpack/releases)
- webpack-dev-middleware: v3.1.3 → [v3.7.2](https://github.com/webpack/webpack-dev-middleware/blob/master/CHANGELOG.md#372-2019-09-28)
- webpack-dev-server: v3.1.5 → [v3.10.3](https://github.com/webpack/webpack-dev-server/blob/master/CHANGELOG.md#3103-2020-02-05)
- webpack-hot-middleware: v2.22.3 → [v2.25.0](https://github.com/webpack-contrib/webpack-hot-middleware/compare/v2.22.3...v2.25.0)
- webpack-merge: v4.1.4 → [v4.2.2](https://github.com/survivejs/webpack-merge/blob/master/CHANGELOG.md#422--2019-08-27)
- whatwg-fetch: v2.0.4 → [v3.0.0](https://github.com/github/fetch/releases/tag/v3.0.0)

---

Older changelogs are available in [the CHANGES archive](CHANGES.old.md).

[Muhnad]: https://github.com/Muhnad
[rrapiteanu]: https://github.com/rrapiteanu
