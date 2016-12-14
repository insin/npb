import ora from 'ora'
import webpack from 'webpack'

import createWebpackConfig from './createWebpackConfig'
import debug from './debug'
import getPluginConfig from './getPluginConfig'
import getUserConfig from './getUserConfig'
import {deepToString, defaultNodeEnv} from './utils'
import {logBuildResults} from './webpackUtils'

/**
 * If you pass a non-falsy name, this will handle spinner display and output
 * logging itself, otherwise use the stats provided in the callback.
 */
export default function webpackBuild(name, args, buildConfig = {}, cb) {
  defaultNodeEnv('production')

  let userConfig = getUserConfig(args)
  let pluginConfig = getPluginConfig()
  if (typeof buildConfig == 'function') {
    buildConfig = buildConfig(args)
  }

  let webpackConfig = createWebpackConfig(buildConfig, pluginConfig, userConfig)

  debug('webpack config: %s', deepToString(webpackConfig))

  let spinner
  if (name) {
    spinner = ora(`Building ${name}`).start()
  }
  let compiler = webpack(webpackConfig)
  compiler.run((err, stats) => {
    if (err) {
      if (spinner) {
        spinner.fail()
      }
      return cb(err)
    }
    if (spinner) {
      logBuildResults(stats, spinner)
    }
    cb(null, stats)
  })
}
