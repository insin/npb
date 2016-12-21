import path from 'path'

import glob from 'glob'
import runSeries from 'run-series'

import {getDefaultHTMLConfig} from '../appConfig'
import webpackBuild from '../webpackBuild'
import cleanApp from './clean-app'
import installCompatDependencies from '../installCompatDependencies'

// Using a config function as webpackBuild() sets NODE_ENV to production if it
// hasn't been set by the user and we don't want production optimisations in
// development builds.
function buildConfig(args) {
  let entry = path.resolve(args._[1] || 'src/index.js')
  let dist = path.resolve(args._[2] || 'dist')

  let production = process.env.NODE_ENV === 'production'
  let filenamePattern = production ? '[name].[chunkhash:8].js' : '[name].js'

  let config = {
    babel: {
      commonJSInterop: true,
      presets: ['react'],
    },
    devtool: 'source-map',
    entry: {
      app: [entry],
    },
    output: {
      filename: filenamePattern,
      chunkFilename: filenamePattern,
      path: dist,
      publicPath: '/',
    },
    plugins: {
      html: getDefaultHTMLConfig(),
      vendor: args.vendor !== false,
    },
  }

  if (glob.sync('public/').length !== 0) {
    config.plugins.copy = [{from: path.resolve('public'), to: dist, ignore: '.gitkeep'}]
  }

  if (args.inferno) {
    config.resolve = {
      alias: {
        'react': 'inferno-compat',
        'react-dom': 'inferno-compat',
      }
    }
  }
  else if (args.preact) {
    config.resolve = {
      alias: {
        'react': 'preact-compat',
        'react-dom': 'preact-compat',
      }
    }
  }

  if (production) {
    config.babel.presets.push('react-prod')
  }

  return config
}

/**
 * Build a React app.
 */
export default function buildReactApp(args, cb) {
  let dist = args._[2] || 'dist'

  let library = 'React'
  if (args.inferno) library = 'Inferno (React compat)'
  else if (args.preact) library = 'Preact (React compat)'

  runSeries([
    (cb) => cleanApp({_: ['clean-app', dist]}, cb),
    (cb) => installCompatDependencies(args, cb, library),
    (cb) => webpackBuild(`${library} app`, args, buildConfig, cb),
  ], cb)
}
