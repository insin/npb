import {execSync} from 'child_process'
import util from 'util'

import argvSetEnv from 'argv-set-env'

import debug from './debug'

export function clearConsole() {
  if (process.env.NWB_TEST) return
  // This will completely wipe scrollback in cmd.exe on Windows - recommend
  // using the `start` command to launch nwb's dev server in a new prompt.
  process.stdout.write('\x1bc')
}

/**
 * Create a banner comment for a UMD build file from package.json config.
 */
export function createBanner(pkg) {
  let banner = `${pkg.name} v${pkg.version}`
  if (pkg.homepage) {
    banner += ` - ${pkg.homepage}`
  }
  if (pkg.license) {
    banner += `\n${pkg.license} Licensed`
  }
  return banner
}

/**
 * Create Webpack externals config from a module → global variable mapping.
 */
export function createWebpackExternals(externals = {}) {
  return Object.keys(externals).reduce((webpackExternals, packageName) => {
    let globalName = externals[packageName]
    webpackExternals[packageName] = {
      root: globalName,
      commonjs2: packageName,
      commonjs: packageName,
      amd: packageName,
    }
    return webpackExternals
  }, {})
}

/**
 * Log objects in their entirety so we can see everything in debug output.
 */
export function deepToString(object) {
  return util.inspect(object, {colors: true, depth: null})
}

export function defaultNodeEnv(nodeEnv) {
  // Set cross-platform environment variables based on any --set-env-NAME
  // arguments passed to the command.
  argvSetEnv()
  // Don't override environment it's been set
  if (!process.env.NODE_ENV) {
    // Default environment for a build
    process.env.NODE_ENV = nodeEnv
  }
}

/**
 * String.prototype.endsWith() is behind the --harmony flag in Node.js v0.12.
 */
export function endsWith(s1, s2) {
  return s1.lastIndexOf(s2) === s1.length - s2.length
}

/**
 * Checks if the package manager `yarn` is available
 * @return {Boolean}
 */
export function isYarnAvailable() {
  try {
    execSync('yarn --version', {stdio: 'ignore'})
    return true
  }
  catch (e) {
    return false
  }
}

/**
 * Install all App dependencies
 */
export function installAppDependencies({dev = false, save = false, cwd = process.cwd(), version = 'latest', dependencies = []} = {}) {
  const saveArg = save ? ` --save${dev ? '-dev' : ''}` : ''
  let command
  if (isYarnAvailable) {
    command = `yarn add ${dependencies.join(' ')} ${dev ? '--dev' : ''}`
  }
  else {
    command = `npm install${saveArg} ${dependencies.join(' ')}`
  }
  console.log(`Installing dependencies using ${isYarnAvailable ? 'yarn' : 'npm'}`)
  debug(`${cwd} $ ${command}`)
  execSync(command, {cwd, stdio: 'inherit'})
}

/**
 * Better typeof.
 */
export function typeOf(o) {
  if (Number.isNaN(o)) return 'nan'
  return Object.prototype.toString.call(o).slice(8, -1).toLowerCase()
}
