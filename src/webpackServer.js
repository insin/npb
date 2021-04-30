import {yellow} from 'chalk'
import detect from 'detect-port'
import inquirer from 'inquirer'

import {getPluginConfig, getUserConfig} from './config'
import {DEFAULT_PORT} from './constants'
import createServerWebpackConfig from './createServerWebpackConfig'
import debug from './debug'
import devServer from './devServer'
import {clearConsole, deepToString, typeOf} from './utils'

/**
 * Get the port to run the server on, detecting if the intended port is
 * available first and prompting the user if not.
 */
function getServerPort(args, intendedPort, cb) {
  detect(intendedPort, (err, suggestedPort) => {
    if (err) return cb(err)
    // No need to prompt if the intended port is available
    if (suggestedPort === intendedPort) return cb(null, suggestedPort)
    // Support use of --force to avoid interactive prompt
    if (args.force) return cb(null, suggestedPort)

    if (args.clear !== false && args.clearConsole !== false) {
      clearConsole()
    }
    console.log(yellow(`Something is already running on port ${intendedPort}.`))
    console.log()
    inquirer.prompt([
      {
        type: 'confirm',
        name: 'run',
        message: 'Would you like to run the app on another port instead?',
        default: true,
      },
    ]).then(
      ({run}) => cb(null, run ? suggestedPort : null),
      (err) => cb(err)
    )
  })
}

/**
 * Start a development server with Webpack using a given build configuration.
 */
export default function webpackServer(args, buildConfig, cb) {
  // Default environment to development - we also run the dev server while
  // testing to check that HMR works.
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development'
  }

  if (typeof buildConfig == 'function') {
    buildConfig = buildConfig(args)
  }

  let serverConfig
  try {
    let pluginConfig = getPluginConfig(args)
    serverConfig = getUserConfig(args, {pluginConfig}).devServer
  }
  catch (e) {
    return cb(e)
  }

  getServerPort(args, args.port || Number(serverConfig.port) || DEFAULT_PORT, (err, port) => {
    if (err) return cb(err)
    // A null port indicates the user chose not to run the server when prompted
    if (port === null) return cb()

    serverConfig.port = port
    // Fallback index serving can be disabled with --no-fallback
    if (args.fallback === false) {
      serverConfig.historyApiFallback = false
    }
    // Fallback index serving can be configured with dot arguments
    // e.g. --fallback.disableDotRule --fallback.verbose
    else if (typeOf(args.fallback) === 'object') {
      serverConfig.historyApiFallback = args.fallback
    }
    // The host can be overridden with --host
    serverConfig.host = args.host || 'localhost'
    // Open a browser with --open (default browser) or --open="browser name"
    if (args.open) serverConfig.open = args.open

    let url = `http${serverConfig.https ? 's' : ''}://${serverConfig.host || 'localhost'}:${port}/`

    if (!('status' in buildConfig.plugins)) {
      buildConfig.plugins.status = {
        disableClearConsole: args.clear === false || args['clear-console'] === false,
        successMessage:
          `The app is running at ${url}`,
      }
    }

    let webpackConfig
    try {
      webpackConfig = createServerWebpackConfig(args, buildConfig, serverConfig)
    }
    catch (e) {
      return cb(e)
    }

    debug('webpack config: %s', deepToString(webpackConfig))

    devServer(webpackConfig, serverConfig, url, cb)
  })
}
