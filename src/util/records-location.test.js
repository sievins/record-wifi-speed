const test = require('tape-catch')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

const sandbox = sinon.createSandbox()

const resultsDirectory = 'C:\\path\\to\\results\\directory'
const environmentVariable = sandbox.stub().returns(resultsDirectory)
const resolve = sandbox.spy()

const teardown = () => sandbox.restore()

const requireRecordsLocation = () => (
  proxyquire('./records-location', {
    'path': { resolve },
    './environment-variable': { environmentVariable },
  })
)

test('uses the environment variable \'resultsDirectory\'', (t) => {
  requireRecordsLocation()

  t.ok(environmentVariable.calledWith('resultsDirectory'))

  teardown()
  t.end()
})

test('resolves with records.txt', (t) => {
  requireRecordsLocation()

  t.ok(resolve.calledWith(resultsDirectory, './records.txt'))

  teardown()
  t.end()
})
