const test = require('tape-catch')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

const sandbox = sinon.createSandbox()
const recordWifiSpeed = sandbox.spy()
const environmentVariable = sandbox.stub()
const wifiName = 'PLUSNET-1234'
const resultsDirectory = 'C:\\path\\to\\results\\directory'
environmentVariable.withArgs('wifiName').returns(wifiName)
environmentVariable.withArgs('resultsDirectory').returns(resultsDirectory)

const teardown = () => sandbox.restore()

const requireRunSpeedTest = () => (
  proxyquire('./run-speed-test', {
    './speed-test': recordWifiSpeed,
    '../util': { environmentVariable },
  })
)

test('recordWifiSpeed is invoked with correct arguments', (t) => {
  requireRunSpeedTest()

  t.ok(recordWifiSpeed.calledWith({ wifiName, resultsDirectory }))

  teardown()
  t.end()
})
