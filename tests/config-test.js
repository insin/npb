import path from 'path'

import expect from 'expect'
import webpack from 'webpack'

import {ConfigValidationError} from '../src/errors'
import {getPluginConfig, getUserConfig, getProjectType} from '../src/config'
import {processUserConfig} from '../src/config/user'
import {prepareWebpackRuleConfig, prepareWebpackStyleConfig} from '../src/config/webpack'

describe('getProjectType()', () => {
  it("throws an error when a config file can't be found", () => {
    expect(() => getProjectType({config: 'tests/fixtures/nonexistent.js'}))
      .toThrow(/Couldn't find a config file/)
  })

  it('throws an error when the config file is invalid or otherwise causes an error', () => {
    expect(() => getProjectType({config: 'tests/fixtures/invalid-config.js'}))
      .toThrow(/Couldn't import the config file/)
  })
})

describe('getUserConfig()', () => {
  it("throws an error when a required config file can't be found", () => {
    expect(() => getUserConfig({config: 'tests/fixtures/nonexistent.js'}, {required: true}))
      .toThrow(/Couldn't find a config file/)
  })

  it('throws an error when the config file is invalid or otherwise causes an error', () => {
    expect(() => getUserConfig({config: 'tests/fixtures/invalid-config.js'}))
      .toThrow(/Couldn't import the config file/)
  })

  it("returns default config when a non-required config file can't be found", () => {
    let config = getUserConfig()
    expect(config).toEqual({
      babel: {},
      devServer: {},
      karma: {},
      npm: {},
      webpack: {},
    })
  })
})

function check(config, path, message) {
  let failed = true
  try {
    process(config)
    failed = false
  }
  catch (e) {
    expect(e).toBeA(ConfigValidationError)
    expect(e.report.errors[0]).toMatch({path, message})
  }
  if (!failed) {
    expect(config).toNotExist('should have thrown a validation error')
  }
}

function process(config) {
  return processUserConfig({userConfig: config})
}

describe('processUserConfig()', () => {
  describe('validation', () => {
    it('type is not a string', () => {
      check({type: 'invalid'}, 'type', /Must be/)
    })
    it('browsers is an invalid type', () => {
      check({browsers: /invalid/}, 'browsers', /Must be/)
    })
    it('babel.plugins is not an array', () => {
      check({babel: {plugins: {}}}, 'babel.plugins', /Must be/)
    })
    it('babel.presets is not an array', () => {
      check({babel: {presets: {}}}, 'babel.presets', /Must be/)
    })
    it('babel.proposals is not an object or false', () => {
      check({babel: {proposals: /invalid/}}, 'babel.proposals', /Must be/)
    })
    it('babel.react is not a string or an object', () => {
      check({babel: {react: /invalid/}}, 'babel.react', /Must be/)
    })
    it('babel.reactConstantElements is not a boolean', () => {
      check({babel: {reactConstantElements: 'invalid'}}, 'babel.reactConstantElements', /Must be/)
    })
    it('babel.runtime is not valid', () => {
      check({babel: {runtime: 'welp'}}, 'babel.runtime', /Must be/)
    })
    it('npm contains unexpected prop', () => {
      check({npm: {invalid: true}}, 'npm', /Unexpected prop/)
    })
    it('npm.cjs is an invalid type', () => {
      check({npm: {cjs: 'yes'}}, 'npm.cjs', /Must be/)
    })
    it('npm.esModules is an invalid type', () => {
      check({npm: {esModules: 'no'}}, 'npm.esModules', /Must be/)
    })
    it('npm.umd is an invalid type', () => {
      check({npm: {umd: /invalid/}}, 'npm.umd', /Must be/)
    })
    it('npm.umd contains unexpected prop', () => {
      check({npm: {umd: {invalid: true}}}, 'npm.umd', /Unexpected prop/)
    })
    it('npm.umd.entry is an invalid type', () => {
      check({npm: {umd: {entry: /invalid/}}}, 'npm.umd.entry', /Must be/)
    })
    it('npm.umd.global is an invalid type', () => {
      check({npm: {umd: {global: /invalid/}}}, 'npm.umd.global', /Must be/)
    })
    it('npm.umd.externals is an invalid type', () => {
      check({npm: {umd: {externals: /invalid/}}}, 'npm.umd.externals', /Must be/)
    })
    it('webpack contains unexpected prop', () => {
      check({webpack: {invalid: true}}, 'webpack', /Unexpected prop/)
    })
    it('webpack.aliases is not an object', () => {
      check({webpack: {aliases: 'invalid'}}, 'webpack.aliases', /Must be/)
    })
    it('webpack.autoprefixer is an invalid type', () => {
      check({webpack: {autoprefixer: /invalid/}}, 'webpack.autoprefixer', /Must be/)
    })
    it('webpack.compat is not an object', () => {
      check({webpack: {compat: 'invalid'}}, 'webpack.compat', /Must be/)
    })
    it('webpack.compat contains unexpected prop', () => {
      check({webpack: {compat: {invalid: true}}}, 'webpack.compat', /Unexpected prop/)
    })
    it('webpack.compat.moment is not valid', () => {
      check({webpack: {compat: {moment: /invalid/}}}, 'webpack.compat.moment', /Must be/)
    })
    it('webpack.copy is an invalid type', () => {
      check({webpack: {copy: /test/}}, 'webpack.copy', /Must be/)
    })
    it('webpack.copy is an object missing config', () => {
      check({webpack: {copy: {}}}, 'webpack.copy', /Must include/)
    })
    it('webpack.copy.patterns is not an array', () => {
      check({webpack: {copy: {patterns: {}}}}, 'webpack.copy.patterns', /Must be/)
    })
    it('webpack.copy.options is not an object', () => {
      check({webpack: {copy: {options: []}}}, 'webpack.copy.options', /Must be/)
    })
    it('webpack.define is not an object', () => {
      check({webpack: {define: []}}, 'webpack.define', /Must be/)
    })
    it('webpack.extractCSS is an invalid type', () => {
      check({webpack: {extractCSS: /test/}}, 'webpack.extractCSS', /Must be/)
    })
    it('webpack.html is not an object', () => {
      check({webpack: {html: /test/}}, 'webpack.html', /Must be/)
    })
    it('webpack.install is not an object', () => {
      check({webpack: {install: /test/}}, 'webpack.install', /Must be/)
    })
    it('webpack.publicPath is not a string', () => {
      check({webpack: {publicPath: true}}, 'webpack.publicPath', /Must be/)
    })
    it('webpack.rules is not an object', () => {
      check({webpack: {rules: []}}, 'webpack.rules', /Must be/)
    })
    it('webpack.rules .use config is not an array', () => {
      check({webpack: {rules: {test: {use: 'thing-loader'}}}}, 'webpack.rules.test.use', /Must be/)
    })
    it('webpack.styles is not a specific string', () => {
      check({webpack: {styles: 'invalid'}}, 'webpack.styles', /Must be/)
    })
    it('webpack.styles is not a specific boolean', () => {
      check({webpack: {styles: true}}, 'webpack.styles', /Must be/)
    })
    it('webpack.styles is not an object', () => {
      check({webpack: {styles: []}}, 'webpack.styles', /Must be/)
    })
    it('webpack.styles style type config is unknown', () => {
      check({webpack: {styles: {invalid: []}}}, 'webpack.styles', /Unknown style type/)
    })
    it('webpack.styles style type config is not an array', () => {
      check({webpack: {styles: {css: {}}}}, 'webpack.styles.css', /Must be/)
    })
    it('webpack.styles style type config object contains an invalid property', () => {
      check({webpack: {styles: {css: [{invalid: true}]}}}, 'webpack.styles.css[0]', /Must be/)
    })
    it('webpack.terser is an invalid type', () => {
      check({webpack: {terser: /text/}}, 'webpack.terser', /Must be/)
    })
    it('webpack.extra is not an object', () => {
      check({webpack: {extra: []}}, 'webpack.extra', /Must be/)
    })
    it('webpack.config is not a function', () => {
      check({webpack: {config: {}}}, 'webpack.config', /Must be/)
    })
  })

  describe('regressions', () => {
    it('allows webpack.styles = false (#312)', () => {
      let config = process({webpack: {styles: false}})
      expect(config.webpack.styles).toBe(false)
    })
  })

  describe('convenience shorthand', () => {
    it('allows browsers to be a string', () => {
      let config = process({browsers: 'test'})
      expect(config.browsers).toEqual({development: 'test', production: 'test'})
    })
    it('allows browsers to be an array', () => {
      let config = process({browsers: ['test']})
      expect(config.browsers).toEqual({development: ['test'], production: ['test']})
    })
    it('allows babel.react to be a string', () => {
      let config = process({babel: {react: 'test'}})
      expect(config.babel.react).toEqual({runtime: 'test'})
    })
    it('allows npm.umd to be a string', () => {
      let config = process({npm: {umd: 'test'}})
      expect(config.npm.umd).toEqual({global: 'test'})
    })
    it('allows webpack.copy to be an array', () => {
      let config = process({webpack: {copy: ['test']}})
      expect(config.webpack.copy).toEqual({patterns: ['test']})
    })
  })

  it('passes command and webpack arguments when a config function is provided', () => {
    let args = {_: ['abc123']}
    // Using the webpack.extra escape hatch to pass arguments back out
    let config = processUserConfig({
      args,
      userConfig(args) {
        return {
          webpack: {
            extra: {
              args: args.args,
              command: args.command,
              webpack: args.webpack,
            }
          }
        }
      }
    })
    expect(config.webpack.extra.args).toEqual(args)
    expect(config.webpack.extra.command).toEqual('abc123')
    expect(config.webpack.extra.webpack).toEqual(webpack)
  })

  it('defaults top-level config when none is provided', () => {
    let config = processUserConfig({
      userConfig: {
        type: 'web-module',
      },
    })
    expect(config).toEqual({
      type: 'web-module',
      babel: {},
      devServer: {},
      karma: {},
      npm: {},
      webpack: {},
    })
  })
})

describe('prepareWebpackRuleConfig()', () => {
  it('does nothing if an options object is already present', () => {
    let config = {
      css: {
        test: /test/,
        include: /include/,
        exclude: /exclude/,
        options: {
          a: 42,
        },
        other: true,
      },
    }
    prepareWebpackRuleConfig(config)
    expect(config.css).toEqual({
      test: /test/,
      include: /include/,
      exclude: /exclude/,
      options: {
        a: 42,
      },
      other: true,
    })
  })
  it('moves non-loader props into an options object', () => {
    let config = {
      css: {
        test: /test/,
        include: /include/,
        exclude: /exclude/,
        loader: 'custom-loader',
        modules: true,
        localIdentName: 'asdf',
      },
    }
    prepareWebpackRuleConfig(config)
    expect(config.css).toEqual({
      test: /test/,
      include: /include/,
      exclude: /exclude/,
      loader: 'custom-loader',
      options: {
        modules: true,
        localIdentName: 'asdf',
      },
    })
  })
})

describe('prepareWebpackStyleConfig()', () => {
  it('moves loader config into a loaders object and loader options into an options object', () => {
    let config = {
      css: [
        {
          include: 'src/components',
          css: {
            modules: true,
          }
        },
        {
          exclude: 'src/components',
        },
      ]
    }
    prepareWebpackStyleConfig(config)
    expect(config).toEqual({
      css: [
        {
          include: 'src/components',
          loaders: {
            css: {
              options: {
                modules: true,
              }
            }
          }
        },
        {
          exclude: 'src/components',
        },
      ]
    })
  })
})

describe('getPluginConfig()', () => {
  it('scans package.json for nwb-* dependencies and imports them', () => {
    let config = getPluginConfig({}, {cwd: path.join(__dirname, 'fixtures/plugins')})
    expect(config).toEqual({
      cssPreprocessors: {
        fake: {
          loader: 'path/to/fake.js',
          test: /\.fake$/,
        },
        fakeVendor: {
          loader: 'path/to/fake.js',
          test: /\.fake$/,
        }
      }
    })
  })
})
