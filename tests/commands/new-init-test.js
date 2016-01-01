import fs from 'fs'
import path from 'path'

import expect from 'expect'
import glob from 'glob'
import rimraf from 'rimraf'
import temp from 'temp'

import cli from '../../src/cli'

function reactAppAssertions(dir, name, err, done) {
  expect(err).toNotExist('No errors creating new React app')
  expect(glob.sync('**', {
    dot: true,
    cwd: path.resolve(dir),
    ignore: 'node_modules/**'
  })).toEqual([
    '.gitignore',
    '.travis.yml',
    'nwb.config.js',
    'package.json',
    'public',
    'public/index.html',
    'README.md',
    'src',
    'src/App.js',
    'src/index.js',
    'tests',
    'tests/.eslintrc',
    'tests/App-test.js'
  ])
  expect(glob.sync('node_modules/*', {
    cwd: path.resolve(dir)
  })).toEqual([
    'node_modules/react',
    'node_modules/react-dom'
  ])
  let pkg = require(path.resolve(dir, 'package.json'))
  expect(pkg.name).toBe(name)
  let config = require(path.resolve(dir, 'nwb.config.js'))
  expect(config).toEqual({type: 'react-app'})
  done()
}

function reactComponentAssertions(dir, name, err, done) {
  expect(err).toNotExist('No errors creating new React component')
  expect(glob.sync('**', {
    cwd: path.resolve(dir),
    dot: true,
    ignore: 'node_modules/**'
  })).toEqual([
    '.gitignore',
    '.travis.yml',
    'demo',
    'demo/src',
    'demo/src/index.js',
    'nwb.config.js',
    'package.json',
    'README.md',
    'src',
    'src/index.js',
    'tests',
    'tests/.eslintrc',
    'tests/index-test.js'
  ])
  expect(glob.sync('node_modules/*', {
    cwd: path.resolve(dir)
  })).toEqual([
    'node_modules/react',
    'node_modules/react-dom'
  ])
  let pkg = require(path.resolve(dir, 'package.json'))
  expect(pkg.name).toBe(name)
  expect(pkg['jsnext:main']).toBe('es6/index.js')
  let config = require(path.resolve(dir, 'nwb.config.js'))
  expect(config).toEqual({
    type: 'react-component',
    umd: false,
    global: '',
    externals: {react: 'React'},
    jsNext: true
  })
  done()
}

function webAppAssertions(dir, name, err, done) {
  expect(err).toNotExist('No errors creating new web app')
  expect(glob.sync('**', {
    dot: true,
    cwd: path.resolve(dir)
  })).toEqual([
    '.gitignore',
    '.travis.yml',
    'nwb.config.js',
    'package.json',
    'public',
    'public/index.html',
    'README.md',
    'src',
    'src/index.js',
    'tests',
    'tests/.eslintrc',
    'tests/index-test.js'
  ])
  let pkg = require(path.resolve(dir, 'package.json'))
  expect(pkg.name).toBe(name)
  let config = require(path.resolve(dir, 'nwb.config.js'))
  expect(config).toEqual({type: 'web-app'})
  done()
}

function webModuleAssertions(dir, name, err, done) {
  expect(err).toNotExist('No errors creating new web module')
  expect(glob.sync('**', {
    cwd: path.resolve(dir),
    dot: true
  })).toEqual([
    '.gitignore',
    '.travis.yml',
    'nwb.config.js',
    'package.json',
    'README.md',
    'src',
    'src/index.js',
    'tests',
    'tests/.eslintrc',
    'tests/index-test.js'
  ])
  let pkg = require(path.resolve(dir, 'package.json'))
  expect(pkg.name).toBe(name)
  expect(pkg['jsnext:main']).toBe('es6/index.js')
  let config = require(path.resolve(dir, 'nwb.config.js'))
  expect(config).toEqual({
    type: 'web-module',
    umd: false,
    global: '',
    externals: {},
    jsNext: true
  })
  done()
}

describe('command: nwb new', function() {
  this.timeout(40000)

  let originalCwd
  let tmpDir

  beforeEach(() => {
    originalCwd = process.cwd()
    tmpDir = temp.mkdirSync('nwb-new')
    process.chdir(tmpDir)
  })

  afterEach(done => {
    process.chdir(originalCwd)
    rimraf(tmpDir, done)
  })

  describe('with missing or invalid arguments', function() {
    this.timeout(200)
    it('prints usage info without any arguments', done => {
      cli(['new'], err => {
        expect(err).toExist()
        expect(err.message).toContain('usage: nwb new')
        done()
      })
    })
    it('requires a project type', done => {
      cli(['new', ''], err => {
        expect(err).toExist()
        expect(err.message).toContain('a project type must be provided')
        done()
      })
    })
    it('requires a valid project type', done => {
      cli(['new', 'test-app'], err => {
        expect(err).toExist()
        expect(err.message).toContain('project type must be one of')
        done()
      })
    })
    it('requires a project name', done => {
      cli(['new', 'web-module'], err => {
        expect(err).toExist()
        expect(err.message).toContain('a project name must be provided')
        done()
      })
    })
    it('checks if the project directory already exists', done => {
      fs.mkdirSync('existing-dir')
      cli(['new', 'web-module', 'existing-dir', '-f'], err => {
        expect(err).toExist()
        expect(err.message).toContain('directory already exists')
        done()
      })
    })
  })

  it('creates a new web module with a given name', done => {
    cli(['new', 'web-module', 'test-module', '-f'], err => {
      webModuleAssertions('test-module', 'test-module', err, done)
    })
  })

  it('creates a new React component with a given name', done => {
    cli(['new', 'react-component', 'test-component', '-f'], err => {
      reactComponentAssertions('test-component', 'test-component', err, done)
    })
  })

  it('creates a new React app with a given name', done => {
    cli(['new', 'react-app', 'test-react-app'], err => {
      reactAppAssertions('test-react-app', 'test-react-app', err, done)
    })
  })

  it('creates a new web app with a given name', done => {
    cli(['new', 'web-app', 'test-web-app'], err => {
      webAppAssertions('test-web-app', 'test-web-app', err, done)
    })
  })
})

describe('command: nwb init', function() {
  this.timeout(40000)

  let originalCwd
  let tmpDir
  let defaultName

  beforeEach(() => {
    originalCwd = process.cwd()
    tmpDir = temp.mkdirSync('nwb-init')
    defaultName = path.basename(tmpDir)
    process.chdir(tmpDir)
  })

  afterEach(done => {
    process.chdir(originalCwd)
    rimraf(tmpDir, done)
  })

  describe('with missing or invalid arguments', function() {
    this.timeout(200)
    it('prints usage info without any arguments', done => {
      cli(['init'], err => {
        expect(err).toExist()
        expect(err.message).toContain('usage: nwb init')
        done()
      })
    })
    it('requires a project type', done => {
      cli(['init', ''], err => {
        expect(err).toExist()
        expect(err.message).toContain('a project type must be provided')
        done()
      })
    })
    it('requires a valid project type', done => {
      cli(['init', 'test-app'], err => {
        expect(err).toExist()
        expect(err.message).toContain('project type must be one of')
        done()
      })
    })
  })

  it('initialises a web module in the current directory', done => {
    cli(['init', 'web-module', '-f'], err => {
      webModuleAssertions('.', defaultName, err, done)
    })
  })

  it('initialises a React component in the current directory', done => {
    cli(['init', 'react-component', '-f'], err => {
      reactComponentAssertions('.', defaultName, err, done)
    })
  })

  it('initialises a React app in the current directory', done => {
    cli(['init', 'react-app'], err => {
      reactAppAssertions('.', defaultName, err, done)
    })
  })

  it('initialises a web app in the current directory', done => {
    cli(['init', 'web-app'], err => {
      webAppAssertions('.', defaultName, err, done)
    })
  })
})
