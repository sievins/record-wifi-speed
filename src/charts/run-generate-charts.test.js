const test = require('tape-catch')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

const resultsDirectory = 'C:\\path\\to\\results\\directory'
const numberOfGroups = 10

const sandbox = sinon.createSandbox()
const generateCharts = sandbox.spy()
const environmentVariable = sandbox.stub()

const teardown = () => sandbox.restore()

const requireRunGenerateCharts = () => (
  proxyquire('./run-generate-charts', {
    './histogram': { generateCharts },
    '../util': { environmentVariable },
  })
)

test('generateCharts is invoked with correct arguments', (t) => {
  environmentVariable.withArgs('resultsDirectory').returns(resultsDirectory)
  environmentVariable.withArgs('numberOfGroups').returns(numberOfGroups.toString())

  requireRunGenerateCharts()

  t.ok(generateCharts.calledWith({ resultsDirectory, numberOfGroups }))

  teardown()
  t.end()
})

test('numberOfGroups is undefined when there is no env var', (t) => {
  environmentVariable.withArgs('resultsDirectory').returns(resultsDirectory)
  environmentVariable.withArgs('numberOfGroups').returns(undefined)

  requireRunGenerateCharts()

  t.ok(generateCharts.calledWith({ resultsDirectory, numberOfGroups: undefined }))

  teardown()
  t.end()
})
