# Developing React Components and Libraries with nwb

nwb supports development of React component/library modules which will be published to npm.

> **Prerequisite:** nwb must be installed globally (we're using version 0.16 in this guide):
>
> ```
> npm install -g nwb
> ```

- [Creating a New Project](#creating-a-new-project)
  - [Build Configuration Questions](#build-configuration-questions)
    - [ECMAScript Modules Build](#ecmascript-modules-build)
    - [Universal Module Definition (UMD) Build](#universal-module-definition-umd-build)
- [Project Layout](#project-layout)
- [`npm run` Scripts](#npm-run-scripts)
- [Running the Demo App](#running-the-demo-app)
- [Implementation](#implementation)
- [Testing](#testing)
  - [Code Coverage Reporting](#code-coverage-reporting)
  - [Continuous Integration (CI) Testing](#continous-integration-ci-testing)
- [Building and Publishing](#building-and-publishing)
  - [Preparing for Publishing](#preparing-for-publishing)
  - [Publishing to npm](#publishing-to-npm)
- [Libraries](#libraries)
- [Build Configuration](#build-configuration)
  - [Config File](#config-file)
    - [UMD Externals](#umd-externals)
  - [Feature Toggles](#feature-toggles)
    - [`--copy-files`](#--copy-files)
    - [`--no-demo`](#--no-demo)
    - [`--[keep-]proptypes`](#--keep-proptypes)

To walk you through the process, we're going to implement a simple `LoadingButton` component, which renders a `<button>` and implements the following requirements:

1. The button should take a `loading` prop, representing whichever action it controls being in progress (e.g. loading some data or submitting a form).
2. The button should be `disabled` when loading, to avoid the double-submission problem.
3. The button should default to `type="button"` instead of `<button>`'s usual `type="submit"`, which can be a surprising default.

## Creating a New Project

Use the `nwb new` command to create a new React component project:

```
nwb new react-component react-loading-button
```

You'll be asked a few questions about your project's build configuration.

> **Note:** If you want to skip these questions, you can pass an `-f` or `--force` flag to accept the default configuration, or just keep bashing `Enter` to accept the defaults.
>
> If you want to skip _reading_ about these questions, continue on to [Project Layout](#project-layout).

### Build Configuration Questions

By default, nwb will create a CommonJS build for your project in `lib/`, which is the primary way it will be used when installed via npm, with default `package.json` `main` config pointing to `lib/index.js`.

Configuration questions are asked about _additional_ builds

#### ECMAScript Modules Build

```
Creating a react-component project...
? Do you want to create an ES modules build? (Y/n)
```

An ES modules build retains use of `import` and `export` statements in your code but transpiles everything else to ES5.

Module bundlers like [Webpack](https://webpack.js.org/) and [Rollup](http://rollupjs.org/) can use this build to determine if code was imported but never used and eliminate it from the final bundle.

It's enabled by default, so we can just hit `Enter` to accept the default:

```
? Do you want to create an ES modules build? Yes
```

> **Note:** nwb will create an ES modules build in `es/` when we build the project later.
>
> It will also add `"module"` configuration to `package.json`, for use by ES module bundlers.

#### Universal Module Definition (UMD) Build

```
? Do you want to create a UMD build? (y/N)
```

A [UMD](https://github.com/umdjs/umd#umd-universal-module-definition) build will let people use your module via a global variable by dropping it into a `<script>` tag - this makes it easier to try without any build tooling in an HTML file, and in tools like [JS Bin](http://jsbin.com/) and [CodePen](https://codepen.io/).

Since nwb will handle the details of creating this for us and [unpkg](https://unpkg.com) will allow people to grab the UMD build once published to npm, let's type `y` and hit `Enter`:

```
? Do you want to create a UMD build? Yes
? Which global variable name should the UMD build set?
```

We also need to provide the global variable name for the UMD build to set.

The convention in the React community seems to be a TitleCase version of your module's name, so let's go with `ReactLoadingButton`.

```
? Which global variable name should the UMD build set? ReactLoadingButton
```

> **Note:** nwb will create development `react-loading-button.js` and production `react-loading-button.min.js` UMD builds in `umd/` when we build the project later.

## Project Layout

The following directory structure will be created, with `react` and `react-dom` dependencies installed from npm into `node_modules/`:

```
react-loading-button/
  .gitignore
  .travis.yml
  CONTRIBUTING.md
  nwb.config.js
  package.json
  README.md
  demo/
    src/
      index.js
  node_modules/
  src/
    index.js
  tests/
    .eslintrc
    index.test.js
```

**demo/**: Contains a React application you can develop your module against using nwb's development server.

**node_modules/**: Contains modules installed with npm. npm is the standard way to manage front-end, back-end and development dependencies for React projects. `react` and `react-dom` dependencies will be installed from npm into `node_modules/` as part of project creation.

**nwb.config.js**: This file can be used to tweak or extend the default configuration nwb provides.

**src/**: Contains your React module's source.

**tests/**: nwb will find and run tests in a separate `tests/` directory or co-located with your source code under `src/`, as long as their filenames end with `.test.js` or `.spec.js` - an example of a basic React component test is provided.

---

`cd` into the project directory and we can get started on our example component:

```sh
cd react-loading-button/
```

> **Note:** You can use the `npm init` command instead if you want to create a project in the current directory.

## `npm run` Scripts

`package.json` is configured with `"scripts"` we can use with `npm run` while developing the project.

| Command                 | Description                                                 |
| ----------------------- | ----------------------------------------------------------- |
| `npm start`             | start a development server for the demo app                 |
| `npm test`              | run tests                                                   |
| `npm run test:coverage` | run tests and produce a code coverage report in `coverage/` |
| `npm run test:watch`    | start a test server and re-run tests on every change        |
| `npm run build`         | prepare for publishing to npm                               |
| `npm run clean`         | delete built resources                                      |

The initial project is set up so you can successfully run each of these commands and get some meaningful output, albeit for a component which does nothing more than render a welcome message.

## Running the Demo App

The project skeleton includes a demo app in `demo/src/index.js`.

> **Note:** If you don't need the demo app, you can safely delete the `demo/` directory.

Running `npm start` will start a development server for the demo app. Every time you make a change to the demo app or the component, it will refresh the current compilation status.

![](resources/react-serve.png)

If there are any errors, they will be displayed in both the console and the browser, so you're unlikely to miss them while developing.

|                     Console Error                      |                     Browser Error                      |
| :----------------------------------------------------: | :----------------------------------------------------: |
| ![](resources/react-component-serve-error-console.png) | ![](resources/react-component-serve-error-browser.png) |

Developing components against a hot-reloading app provides a quick feedback loop.

If you're into README Driven Development, it also provides a place to play with your component's API before you've built anything, and tinker with it live as you implement.

Let's start by imagining how we'll use our `LoadingButton` component in the demo app:

> **Note:** This Demo component is implemented as a class extending React's `Component` class, but also uses a [proposed language feature - class properties](/docs/Configuration.md#proposals-object--false), which is enabled by default when using nwb.
>
> Don't sweat the details of if you're not familiar with this; the most important thing for this guide is the `render()` method.

```js
import React, { Component } from "react";
import { render } from "react-dom";

import LoadingButton from "../../src";

class Demo extends Component {
  state = { loading: false };

  handleToggleLoading = () => {
    this.setState({ loading: !this.state.loading });
  };

  render() {
    return (
      <div>
        <h1>react-loading-button Demo</h1>

        <h2>Static</h2>
        <LoadingButton>Load</LoadingButton>
        <LoadingButton loading>Loading</LoadingButton>

        <h2>Dynamic</h2>
        <LoadingButton loading={this.state.loading}>
          {this.state.loading ? "Loading" : "Load"}
        </LoadingButton>
        <button type="button" onClick={this.handleToggleLoading}>
          Toggle Loading
        </button>
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
```

Once your component is developed, the demo app falls back to its primary purpose of creating a demo you can deploy when publishing your code _without_ having to build and publish separately, as component builds and demo bundles are built from the same source at the same time.

## Implementation

Here's an example implementation of the `LoadingButton` component:

```js
import t from "prop-types";
import React, { Component } from "react";

class LoadingButton extends Component {
  static propTypes = {
    disabled: t.bool,
    loading: t.bool,
    type: t.string,
  };
  static defaultProps = {
    disabled: false,
    loading: false,
    type: "button",
  };
  render() {
    let { children, disabled, loading, type, ...props } = this.props;
    if (loading) {
      disabled = true;
    }
    return (
      <button disabled={disabled} type={type} {...props}>
        {children}
      </button>
    );
  }
}

export default LoadingButton;
```

![](resources/react-component-demo.gif)

## Testing

nwb provides a default testing setup which uses Karma to run tests written with Mocha and Expect in the a headless Chrome browser.

> The [Testing documentation](/docs/Testing.md) provides an in-depth overview of what nwb's default testing setup provides (and how to configure things to your liking if you want to), but we'll stick to editing the initial test provided in the React component project skeleton, in `tests/index.test.js`.

`npm run test:watch` automatically re-runs tests on every change to provide a quick feedback loop while developing, whether you're writing tests up-front, in parallel with implementation or after the fact.

If you're into Test Driven Development, it will give you the flow you want as you write breaking tests followed by implementations which satisfy them.

The following example tests were implemented after the `LoadingButton` component was written, adding one `it()` block at a time and tweaking each test based on feedback from re-runs - for example, I wasn't sure how a `disabled={true}` prop would be represented in the resulting HTML, so I used `.toContain('')` to see what would happen.

> **Note 1:** Testing against static HTML output is a brittle way to assert what your components are returning from their `render()` methods, but it's handy for our demonstration purposes.

> **Note 2:** We're importing the [expect](https://github.com/mjackson/expect/) library below, but it's not included in `package.json` - nwb handles the expect dependency for you so you can get started with testing without having to make a decision. Other assertion and spy libraries are available :)

```js
import expect from "expect";
import React from "react";
import { renderToStaticMarkup as render } from "react-dom/server";

import LoadingButton from "src/";

describe("LoadingButton", () => {
  it('renders a button with type="button"', () => {
    expect(render(<LoadingButton>Test</LoadingButton>)).toContain(
      '<button type="button">Test</button>'
    );
  });
  it("disables the button when loading=true", () => {
    expect(render(<LoadingButton loading>Test</LoadingButton>)).toContain(
      '<button disabled="" type="button">Test</button>'
    );
  });
  it("disables the button when loading=true even if disabled=false", () => {
    expect(
      render(
        <LoadingButton disabled={false} loading>
          Test
        </LoadingButton>
      )
    ).toContain('<button disabled="" type="button">Test</button>');
  });
  it("passes other props through", () => {
    expect(
      render(<LoadingButton className="test">Test</LoadingButton>)
    ).toContain('<button type="button" class="test">Test</button>');
  });
});
```

### Code Coverage Reporting

Once your tests are working, you can generate a code coverage report by running `npm run test:coverage`:

![](resources/react-component-test-coverage.png)

Code coverage percentages on their own are fairly meaningless, but running coverage also produces an HTML report in `coverage/html/` showing coverage statistics for each file and annotating your code to show which pieces were and weren't touched during a test run.

![](resources/react-component-test-coverage-html.png)

This HTML report is handy for finding out what your tests _aren't_ covering, and deciding which uncovered areas you'd feel more comfortable having some tests for.

### Continuous Integration (CI) Testing

If you use [GitHub](https://github.com/) for your project's source code hosting, it's pre-configured for running tests on [Travis CI](https://travis-ci.org/) and posting code coverage results to [coveralls](https://coveralls.io/) and [codecov.io](https://codecov.io/) after successful test runs.

If you log in to Travis CI and enable it for your GitHub project, your tests will be run on every subsequent commit and automatically run against Pull Requests.

## Building and Publishing

nwb provides a default setup which keeps your source code repository free from distracting built resources (which can also be confusing for potential contributors) and makes your code usable as part of a standard Node.js development setup, by module bundlers and directly in the browser via `<script>` tag.

### Preparing for Publishing

`npm run build` will prepare the component for publishing, creating:

- A CommonJS build in `lib/`
- An ES modules build in `es/` (enabled by default / without configuration)
- UMD development and production builds in `umd/` (if configuration is provided)

The CommonJS build preserves CommonJS interop using the [`add-module-exports`](https://github.com/59naga/babel-plugin-add-module-exports) plugin, to avoid people using your npm packages via CommonJS `require()` having to tag a `.default` onto every `require()` call.

Any `propTypes` declared by class components or stateless function components will be wrapped with an `if (process.env.NODE_ENV !== 'production')` environment check by default, so they'll be automatically stripped from the production build of apps which use them.

By default nwb will also create a production build of the demo React app in `demo/dist/`, ready for deployment to wherever you want to host the demo (e.g. [Surge](http://surge.sh/) for simple deployment, [GitHub Pages](https://pages.github.com/) for more involved deployment tied in with source control). The demo is configured so it can be served from any directory, so you shouldn't need to configure anything no matter where you're hosting it.

![](resources/react-component-build.png)

`.gitignore` is configured to ignore these build directories to avoid/prevent checking built resources into source control, since npm acts as the canonical source for published, versioned builds and [unpkg](https://unpkg.com) makes it easy to provide access to the UMD build.

For example, if you were to publish this example project to npm as `react-loading-button`, the latest version of its UMD build would be available from `https://unpkg.com/react-loading-button/umd/react-loading-button.js` without having to configure anything.

### Publishing to npm

Once you've built your project, it's ready for publishing to npm using whatever your preferred process for doing that is, with the simplest being manually running `publish`:

```
npm publish
```

`package.json` is pre configured with a [`"files"` whitelist](https://docs.npmjs.com/files/package.json#files) which will only include `lib/`, `es/` and `umd/` directories in the npm package, in addition to the usual npm metadata like `package.json` and `README.md`.

## Libraries

We've demonstrated using nwb to develop and publish a single reusable React component, but the same tooling also applies to developing component libraries (such as [React Bootstrap](http://react-bootstrap.github.io/)) and other React libraries (such as [React Router](https://github.com/ReactTraining/react-router)).

The main difference with libraries is that the entry point (`src/index.js` by default when using nwb) usually imports and re-exports everything the library provides, for users performing top-level imports or using the UMD build.

To make this easier, by default nwb enables Babel proposal plugins for export extensions, which allow you to use [`export default from`](https://github.com/tc39/proposal-export-default-from#readme) and `export * as ns from`(https://github.com/tc39/proposal-export-ns-from) statements to import and re-export modules.

For example, this is a snippet of how [React Bootstrap](https://github.com/react-bootstrap/react-bootstrap) re-exports its components using `export default from` statements:

```js
export Accordion from "./Accordion";
export Alert from "./Alert";
export Badge from "./Badge";
export Breadcrumb from "./Breadcrumb";
export BreadcrumbItem from "./BreadcrumbItem";
```

## Build Configuration

### Config File

You can use [npm build configuration](/docs/Configuration.md#npm-build-configuration) in `nwb.config.js` to tweak your project's build.

#### UMD Externals

The React component build uses [`npm.umd.externals` config](/docs/Configuration.md#externals-object) to make UMD builds use React via a global `React` variable rather than bundling it.

If you have other dependencies users will need to make available globally to use your UMD build, you will need to add suitable configuration for them.

e.g. if your component uses React Router, you'll also need to map the 'react-router' import to the global variable exported by React Router's own UMD build:

```js
module.exports = {
  npm: {
    umd: {
      global: "ReactSomeComponent",
      externals: {
        react: "React",
        "react-router": "ReactRouter",
      },
    },
  },
};
```

### Adding a css pre-processor for sass

Install `node-sass-chokidar` and `npm-run-all`.

```sh
npm install node-sass-chokidar npm-run-all --save-dev
```

Update your `package.json` accordingly:

```json
"scripts": {
    "start": "npm-run-all -p build-css start-js",
    "start-js": "nwb serve-react-demo",
    "build": "npm-run-all build-css build-js",
    "build-css": "node-sass-chokidar src/styles/ -o src/styles",
    "build-js": "nwb build-react-component --copy-files",
    "watch-css": "npm run build-css && node-sass-chokidar src/styles/ -o src/styles --watch --recursive"
}
```

The location `src/styles` is the location of your sass files. Remember to create a base sass file called `style.scss` where you import all the other sass. The other sass files should have filenames beginning with a `_`. For eg:

```
react-loading-button/
  src/
    styles/
      _sass_file_one.scss
      _sass_file_two.scss
      styles.scss
    index.js
```

The sass files will processed to a `styles.css` file which you will have to import to your component.

```js
import '../styles/style.css'
```

The css file will also be available on your build. Don't forget to add the css file to your `.gitignore`. For eg:

```
src/**/*.css
```

### Feature Toggles

Pass flags when running the build to toggle certain features off.

> Add feature toggle flags to the `"build"` script in `package.json` if you always want to use them.
>
> You can also pass flags to the `npm run build` command if you just want to try them out.
>
> You need to pass a `--` argument to indicate all additional arguments should be passed to the command itself, for example:
>
> ```sh
> npm run build -- --no-demo
> ```

#### `--copy-files`

Enables copying of any non-JavaScript files present in `src/` when transpiling to `lib/` and `es/` during a build.

This is a quick (and dirty - please [create an issue](https://github.com/insin/nwb/issues/new) if there are better ways nwb could help you distribute CSS) hack if you're publishing components which import CSS co-located in `src/` and expect users to have Webpack configured to handle this.

> **Note:** This feature is [implemented by Babel](https://babeljs.io/docs/usage/cli/#babel-copy-files), If you disable both CommonJS and ES Module builds, Babel won't be called and nothing will be copied.

> **Note:** The default `package.json` [`"files"` config](https://docs.npmjs.com/files/package.json#files) for a `react-component` project will also publish a top-level `css/` directory to npm if present - consider using relative requires to this directory if you want to avoid publishing duplicated CSS in `lib/` and `es/`.

#### `--no-demo`

Disables building the demo app.

Use this if you want to develop against the demo app using nwb's development server, but have your own setup for demonstrating your module.

> If you don't need the demo app at all, you can delete `demo/`.

#### `--[keep-]proptypes`

Disables `propTypes` wrapping/stripping.

Use this if your module needs to use `propTypes` at runtime (e.g. for masking `props`), or you think its users might need them.
