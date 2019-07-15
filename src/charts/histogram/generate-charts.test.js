const test = require('tape-catch')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

const sandbox = sinon.createSandbox()

const download = [{ key: '1.00 - 3.00', value: 1 }]
const upload = [{ key: '1.00 - 3.00', value: 2 }]
const ping = [{ key: '1.00 - 3.00', value: 3 }]
const resultsDirectory = '/path/to/results/directory'
const chartsDirectory = '/path/to/results/directory/charts'
const downloadPath = '/path/to/results/directory/charts/download'
const uploadPath = '/path/to/results/directory/charts/upload'
const pingPath = '/path/to/results/directory/charts/ping'
const d3nBarData = 'd3BarData'

const resolve = sandbox.stub()
resolve.withArgs(resultsDirectory).returns(chartsDirectory)
resolve.withArgs(chartsDirectory, './download').returns(downloadPath)
resolve.withArgs(chartsDirectory, './upload').returns(uploadPath)
resolve.withArgs(chartsDirectory, './ping').returns(pingPath)
const d3nBar = sandbox.stub()
d3nBar.returns(d3nBarData)
const mkdirSync = sandbox.spy()
const output = sandbox.spy()

const teardown = () => sandbox.restore()

const generateCharts = proxyquire('./generate-charts', {
  'path': { resolve },
  'fs': { mkdirSync },
  'd3node-barchart': d3nBar,
  'd3node-output': output,
  './data': { download, upload, ping },
})

test('creates directory to output charts into', (t) => {
  generateCharts({ resultsDirectory })

  t.ok(mkdirSync.calledWith(chartsDirectory, { recursive: true }))

  teardown()
  t.end()
})

test('creates charts', (t) => {
  generateCharts({ resultsDirectory })

  t.ok(d3nBar.firstCall.calledWithMatch({ data: download }))
  t.ok(d3nBar.secondCall.calledWithMatch({ data: upload }))
  t.ok(d3nBar.thirdCall.calledWithMatch({ data: ping }))

  teardown()
  t.end()
})

test('outputs charts', (t) => {
  generateCharts({ resultsDirectory })

  const options = { width: 960, height: 600 }
  t.ok(output.firstCall.calledWithMatch(downloadPath, d3nBarData, options))
  t.ok(output.secondCall.calledWithMatch(uploadPath, d3nBarData, options))
  t.ok(output.thirdCall.calledWithMatch(pingPath, d3nBarData, options))

  teardown()
  t.end()
})
