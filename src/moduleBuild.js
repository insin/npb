import fs from 'fs'
import path from 'path'

import glob from 'glob'
import ora from 'ora'
import temp from 'temp'
import merge from 'webpack-merge'

import cleanModule from './commands/clean-module'
import createBabelConfig from './createBabelConfig'
import debug from './debug'
import {UserError} from './errors'
import exec from './exec'
import getUserConfig from './getUserConfig'
import {createBanner, createWebpackExternals, deepToString} from './utils'
import webpackBuild from './webpackBuild'
import {logGzippedFileSizes} from './webpackUtils'

// These match DEFAULT_TEST_DIRS and DEFAULT_TEST_FILES for co-located tests in
// ./createKarmaConfig.js; unfortunately Babel doesn't seem to support reusing
// the same patterns.
const DEFAULT_BABEL_IGNORE_CONFIG = [
  '.spec.js',
  '.test.js',
  '-test.js',
  '/__tests__/'
]

/**
 * Runs Babel with generated config written to a temporary .babelrc.
 */
function runBabel({copyFiles, outDir, src}, buildBabelConfig, userBabelConfig) {
  let babelConfig = createBabelConfig(buildBabelConfig, userBabelConfig)
  babelConfig.ignore = DEFAULT_BABEL_IGNORE_CONFIG

  let babelArgs = [src, '--out-dir', outDir, '--quiet']
  if (copyFiles) {
    babelArgs.push('--copy-files')
  }

  debug('babel config: %s', deepToString(babelConfig))

  fs.writeFileSync('.babelrc', JSON.stringify(babelConfig, null, 2))
  try {
    exec('babel', babelArgs)
  }
  finally {
    fs.unlinkSync('.babelrc')
  }
}

export default function moduleBuild(args, buildConfig = {}, cb) {
  // XXX Babel doesn't support passing the path to a babelrc file any more
  if (glob.sync('.babelrc').length > 0) {
    throw new UserError(
      'Unable to build the module as there is a .babelrc in your project',
      'nwb needs to write a temporary .babelrc to configure the build',
    )
  }

  cleanModule(args)

  let src = path.resolve('src')
  let userConfig = getUserConfig(args)
  let copyFiles = !!args['copy-files']

  let spinner = ora('Creating ES5 build').start()
  runBabel(
    {copyFiles, outDir: path.resolve('lib'), src},
    merge(buildConfig.babel, buildConfig.babelDev || {}, {
      // Don't force ES5 users of the ES5 build to eat a .require
      plugins: [require.resolve('babel-plugin-add-module-exports')],
      // Don't set the path to nwb's babel-runtime, as it will need to be a
      // peerDependency of your module if you use transform-runtime's helpers
      // option.
      setRuntimePath: false,
    }),
    userConfig.babel,
  )
  spinner.succeed()

  // The ES6 modules build is enabled by default, and must be explicitly
  // disabled if you don't want it.
  if (userConfig.npm.esModules !== false) {
    spinner = ora('Creating ES6 modules build').start()
    runBabel(
      {copyFiles, outDir: path.resolve('es'), src},
      merge(buildConfig.babel, buildConfig.babelDev || {}, {
        // Don't transpile modules, for use by ES6 module bundlers
        modules: false,
        // Don't set the path to nwb's babel-runtime, as it will need to be a
        // peerDependency of your module if you use transform-runtime's helpers
        // option.
        setRuntimePath: false,
      }),
      userConfig.babel,
    )
    spinner.succeed()
  }

  temp.cleanupSync()

  if (!userConfig.npm.umd) {
    return cb()
  }

  spinner = ora('Creating UMD builds').start()

  let pkg = require(path.resolve('package.json'))
  let entry = path.resolve(args._[1] || 'src/index.js')
  let webpackBuildConfig = {
    babel: buildConfig.babel,
    entry: [entry],
    output: {
      filename: `${pkg.name}.js`,
      library: userConfig.npm.umd.global,
      libraryTarget: 'umd',
      path: path.resolve('umd'),
    },
    externals: createWebpackExternals(userConfig.npm.umd.externals),
    polyfill: false,
    plugins: {
      banner: createBanner(pkg),
    },
  }

  process.env.NODE_ENV = 'development'
  webpackBuild(args, webpackBuildConfig, (err, stats1) => {
    if (err) {
      spinner.fail()
      return cb(err)
    }
    process.env.NODE_ENV = 'production'
    webpackBuildConfig.babel = merge(buildConfig.babel, buildConfig.babelProd || {})
    webpackBuildConfig.devtool = 'source-map'
    webpackBuildConfig.output.filename = `${pkg.name}.min.js`
    webpackBuild(args, webpackBuildConfig, (err, stats2) => {
      if (err) {
        spinner.fail()
        return cb(err)
      }
      spinner.succeed()
      console.log()
      logGzippedFileSizes(stats1, stats2)
      cb()
    })
  })
}
