import path from 'path'

import resolve from 'resolve'
import merge from 'webpack-merge'

import debug from '../debug'
import {deepToString, getArgsPlugins, unique} from '../utils'

function getPackagePlugins(cwd) {
  let pkg = require(path.join(cwd, 'package.json'))
  return [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ].filter(dep => /^(@[^/]+\/)?nwb-/.test(dep))
}

/**
 * Look for nwb-* plugin dependencies in package.json and plugins specified as
 * arguments when supported, import them and merge the plugin config objects
 * they export.
 */
export function getPluginConfig(args = {}, {cwd = process.cwd()} = {}) {
  let plugins = []

  try {
    let pkgPlugins = plugins.concat(getPackagePlugins(cwd))
    debug('%s nwb-* dependencies in package.json', pkgPlugins.length)
    plugins = plugins.concat(pkgPlugins)
  }
  catch (e) {
    // pass
  }

  let argsPlugins = getArgsPlugins(args)
  if (argsPlugins.length !== 0) {
    debug('%s plugins in arguments', argsPlugins.length)
    plugins = plugins.concat(argsPlugins)
  }

  if (plugins.length === 0) {
    return {}
  }

  plugins = unique(plugins)
  debug('nwb plugins: %o', plugins)

  let pluginConfig = {}
  plugins.forEach(plugin => {
    let pluginModule = require(resolve.sync(plugin, {basedir: cwd}))
    pluginConfig = merge(pluginConfig, pluginModule)
  })

  debug('plugin config: %s', deepToString(pluginConfig))

  return pluginConfig
}
