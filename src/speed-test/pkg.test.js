const test = require('tape-catch')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

const sandbox = sinon.createSandbox()

const runSpeedTestPath = '/path/to/run-speed-test.js'
const resolve = sandbox.stub().returns(runSpeedTestPath)
const exec = sandbox.spy()

const teardown = () => sandbox.restore()

const requirePkg = () => (
  proxyquire('./pkg', {
    'path': { resolve },
    'pkg': { exec },
  })
)

test('resolves run-speed-test.js', (t) => {
  requirePkg()

  t.ok(resolve.calledWith(__dirname, './run-speed-test.js'))

  teardown()
  t.end()
})

test('exec invoked with correct arguments', (t) => {
  requirePkg()

  t.ok(exec.calledWith([
    runSpeedTestPath,
    '--target', 'host',
    '--output', 'record-wifi-speed.exe',
  ]))

  teardown()
  t.end()
})
