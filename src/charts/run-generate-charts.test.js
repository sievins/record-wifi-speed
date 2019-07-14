const test = require('tape-catch')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

const sandbox = sinon.createSandbox()
const generateCharts = sandbox.spy()
const environmentVariable = sandbox.stub()
const resultsDirectory = 'C:\\path\\to\\results\\directory'
environmentVariable.withArgs('resultsDirectory').returns(resultsDirectory)

const teardown = () => sandbox.restore()

const requireRunGenerateCharts = () => (
  proxyquire('./run-generate-charts', {
    './histogram': { generateCharts },
    '../util': { environmentVariable },
  })
)

test('generateCharts is invoked with correct arguments', (t) => {
  requireRunGenerateCharts()

  t.ok(generateCharts.calledWith({ resultsDirectory }))

  teardown()
  t.end()
})
