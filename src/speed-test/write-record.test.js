const test = require('tape-catch')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

const sandbox = sinon.createSandbox()
const mkdirSync = sandbox.spy()
const writeFileSync = sandbox.spy()
const readFileSync = sandbox.stub()
const resultsDirectory = 'C:\\path\\to'
const recordsLocation = 'C:\\path\\to\\records.txt'
const record = { 'ping': 1, 'download': 1, 'upload': 1, 'day': '01/01/1970', 'time': '12:00' }

const teardown = () => sandbox.restore()

const writeRecord = proxyquire('./write-record', {
  'fs': {
    mkdirSync,
    writeFileSync,
    readFileSync,
  },
  '../util': {
    recordsLocation,
  },
})

test('create file if it doesn\'t exist', (t) => {
  readFileSync.throws()

  writeRecord(resultsDirectory, '')

  t.ok(mkdirSync.calledWith(resultsDirectory, { recursive: true }))
  t.ok(writeFileSync.calledWith(recordsLocation))

  teardown()
  t.end()
})

test('create file with the first record if it doesn\'t exist', (t) => {
  readFileSync.throws()

  writeRecord(resultsDirectory, record)

  t.ok(writeFileSync.calledWith(
    recordsLocation,
    '[{"ping":1,"download":1,"upload":1,"day":"01/01/1970","time":"12:00"}]\n',
  ))

  teardown()
  t.end()
})

test('add the first record if the file exists but is empty', (t) => {
  readFileSync.returns(Buffer.from(''))

  writeRecord(resultsDirectory, record)

  t.ok(writeFileSync.calledWith(
    recordsLocation,
    '[{"ping":1,"download":1,"upload":1,"day":"01/01/1970","time":"12:00"}]\n',
  ))

  teardown()
  t.end()
})

test('append record to a file which already has records', (t) => {
  const currentRecord = '[{"ping":0,"download":0,"upload":0,"day":"01/01/1970","time":"00:00"}]\n'
  readFileSync.returns(Buffer.from(currentRecord))

  writeRecord(resultsDirectory, record)

  t.ok(writeFileSync.calledWith(
    recordsLocation,
    '[{"ping":0,"download":0,"upload":0,"day":"01/01/1970","time":"00:00"},\n{"ping":1,"download":1,"upload":1,"day":"01/01/1970","time":"12:00"}]\n',
  ))

  teardown()
  t.end()
})
