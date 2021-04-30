## Stylesheets

nwb generates Webpack `module.rules` configuration which allows you to import stylesheets directly from JavaScript modules:

```js
import './App.css'

import React from 'react'

export default class App extends React.Component {
  // ...
}
```

When running a development server, imported stylesheets will be injected into the page using `<style>` elements and hot-reloaded when they change.

When running a production build, imported stylesheets will be extracted out to static `.css` files.

- [Default Stylesheet Rules](#default-stylesheet-rules)
  - [Default Rules for CSS Preprocessor Plugins](#default-rules-for-css-preprocessor-plugins)
  - [Configuring PostCSS](#configuring-postcss)
- [Custom Stylesheet Rules](#custom-stylesheet-rules)
  - [Stylesheet Rule Configuration](#stylesheet-rule-configuration)
    - [Included Files](#included-files)
    - [Loader Options](#loader-options)
- [Disabling Style Rules](#disabling-style-rules)

### Default Stylesheet Rules

> **Note:** each generated Webpack rule and chained loader has an associated unique id which can be used in [`webpack.rules` configuration](/docs/Configuration.md#rules-object) to tweak its configuration.

Without any [`webpack.styles` configuration](/docs/Configuration.md#styles-object--false), nwb generates a rule (id: `css-rule`) which handles `.css` files by chaining together a number of loaders:

- loader id: `style` - applies styles using [style-loader][style-loader]

  > **Note:** use of this loader is only configured when running a development server

- loader id: `css` - handles URLs, minification and can be configured to enable [CSS Modules][Css Modules], using [css-loader][css-loader]

  > Default config: `{options: {importLoaders: 1}}`

- loader id: `postcss` - processes CSS with PostCSS plugins using [postcss-loader][postcss-loader]; by default, this is configured to manage vendor prefixes in CSS using [Autoprefixer][autoprefixer]

  > Default config: `{options: {plugins: [Autoprefixer]}}`

#### Default Rules for CSS Preprocessor Plugins

To allow you to import preprocessed stylesheets just by having a [CSS preprocessor plugin](/docs/Plugins.md#css-preprocessor-plugins) installed, nwb will generate a default Webpack rule for every CSS preprocessor plugin in your `package.json`.

For example, if you install the [nwb-sass](https://github.com/insin/nwb-sass) plugin, nwb will also generate a default `sass-rule` rule which will allow you to import `.scss` and `.sass` stylesheets, chaining together the same loaders as the default `css-rule` above plus a loader for the preprocessor.

Ids for configuring this rule and its loaders using `webpack.rules` follow a similar pattern `css-rule`, except they prefix the name of the preprocessor to make them unique:

- rule id: `sass-rule`
  - loader id: `sass-style`
  - loader id: `sass-css`
  - loader id: `sass-postcss`
  - loader id: `sass` - preprocesses imported stylesheets using [sass-loader][sass-loader]

The same pattern applies for nwb-stylus and nwb-less.

e.g. to enable CSS Modules in the default `sass-rule`'s `css-loader`:

```js
module.exports = {
  webpack: {
    rules: {
      'sass-css': {
        modules: true,
        localIdentName: '[name]__[local]__[hash:base64:5]'
      }
    }
  }
}
```

#### Configuring PostCSS

By default, nwb uses [PostCSS](http://postcss.org/) to manage vendor prefixes in CSS using [Autoprefixer][autoprefixer].

If you want to make more significant use of PostCSS, you can use `webpack.rules` to provide your own list of plugins.

e.g. to provide your own list of plugins for your app's own CSS, configure `webpack.rules.postcss`:

```js
module.exports = {
  webpack: {
    rules: {
      postcss: {
        plugins: [
          require('precss')()
          require('autoprefixer')()
        ]
      }
    }
  }
}

```

### Custom Stylesheet Rules

If your application needs more than one stylesheet rule, you can configure generation of multiple rules using [`webpack.styles` config](/docs/Configuration.md#styles-object--false).

This should be an object defining lists of style rule configuration objects, with properties named for the type of rule being configured.

Rules for vanilla `.css` files are configured with a `css` property and rules for CSS preprocessor plugins are configured using the appropriate plugin name, e.g. `sass` when using `nwb-sass`.

```js
module.exports = {
  webpack: {
    styles: {
      css: [/* ... */],
      sass: [/* ... */]
    }
  }
}
```

#### Stylesheet Rule Configuration

Stylesheet rule configuration objects trigger generation of a rule with chained loaders as per the [default configuration](#default-stylesheet-rules) above and allow you to configure loader options for the rule.

##### Included Files

Specify which files the rule applies to using `test`, `include` and `exclude` properties.

Default `test` config will be provided for each style type - e.g. `/\.css$/` for `css` rules - but you can override it if necessary.

##### Loader Options

Loader options can be configured using a property which matches the loader's name: `style`, `css`,`postcss` or the name of any preprocessor loader being used.

e.g. to configure use of CSS modules within a specific directory:

```js
// Create a rule which uses CSS Modules for CSS imported from src/components
{
  include: path.resolve('src/components'),
  // The 'css' property within a stylesheet rule configures options for css-loader
  css: {
    modules: true,
    localIdentName: (
      process.env.NODE_ENV === 'production'
        ? '[path][name]-[local]-[hash:base64:5]'
        : '[hash:base64:5]'
    )
  }
}
```

With this rule alone, CSS imported from other directories, including `node_modules/`, won't be handled, so we should specify another rule to handle everything else:

```js
// Create a catch-all rule for all other CSS stylesheets
{
  exclude: path.resolve('src/components')
}
```

Putting these together, the final style rule config would look like this:

```js
module.exports = {
  webpack: {
    // Custom stylesheet rule configuration
    styles: {
      // The 'css' property is used to configure rules for vanilla CSS files
      css: [
        // Create a rule which uses CSS modules for CSS imported from src/components
        {
          include: path.resolve('src/components'),
          // Configuration options for css-loader
          css: {
            modules: true,
            localIdentName: (
              process.env.NODE_ENV === 'production'
                ? '[path][name]-[local]-[hash:base64:5]'
                : '[hash:base64:5]'
            )
          }
        },
        // Create a catch-all rule for all other CSS stylesheets
        {
          exclude: path.resolve('src/components')
        }
      ]
    }
  }
}
```

Using this configuration, it's possible to specify multiple rules for stylesheets imported by your app and your dependencies.

For example, [React Toolbox](http://react-toolbox.com/) is a dependency which imports stylesheets on your behalf and requires a specific Webpack setup using [CSS Modules][CSS Modules] and [PostCSS-cssnext](http://cssnext.io/).

```js
var reactToolboxVariables = {
  'button-height': '30px'
}

module.exports = {
  webpack: {
    styles: {
      css: [
        // Create a rule which provides the setup react-toolbox@2.0 needs
        {
          include: /react-toolbox/,
          css: {
            modules: true,
            localIdentName: "[name]--[local]--[hash:base64:8]",
            sourceMap: true
          },
          // The 'postcss' property within a style rule configures options for
          // postcss-loader.
          postcss: {
            plugins: [
              require('postcss-cssnext')({
                features: {
                  customProperties: {
                    variables: reactToolboxVariables
                  }
                }
              }),
              require('postcss-modules-values'),
            ]
          }
        },
        // Create a catch-all rule for other, regular CSS
        {
          exclude: /react-toolbox/
        }
      ]
    }
  }
}
```

### Disabling Style Rules

If you want to handle creating style rules manually, you can disable nwb's default rules by configuring `webpack.styles` as `false`:

```js
module.exports = {
  webpack: {
    styles: false
  }
}
```

If you need to use any of the Webpack loaders nwb manages dependencies for - e.g. `css-loader` and `postcss-loader` - refer to them by loader name in your [`webpack.extra` config](/docs/Configuration.md#extra-object) or [`webpack.config` function](#config-function). nwb configures Webpack to resolve these loaders correctly if they're not installed locally in your project.

[autoprefixer]: https://github.com/postcss/autoprefixer
[CSS Modules]: https://github.com/css-modules/css-modules
[css-loader]: https://github.com/webpack-contrib/css-loader
[postcss-loader]: https://github.com/postcss/postcss-loader
[sass-loader]: https://github.com/jtangelder/sass-loader
[style-loader]: https://github.com/webpack-contrib/style-loader
