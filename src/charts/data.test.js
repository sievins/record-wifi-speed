const test = require('tape-catch')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()
const { includes } = require('ramda')

const errorMessage = 'Could not parse'
const records =
  '[{"ping":1,"download":4,"upload":7,"day":"24/06/2019","time":"17:50"},\n' +
  '{"ping":2,"download":5,"upload":8,"day":"24/06/2019","time":"18:50"},\n' +
  '{"ping":3,"download":6,"upload":9,"day":"29/06/2019","time":"07:30"}]'

const sandbox = sinon.createSandbox()

const readFileSync = sandbox.stub()
const errorLogger = sandbox.spy()

const teardown = () => sandbox.restore()

const requireData = () => (
  proxyquire('./data', {
    'fs': { readFileSync },
    '../util': { logger: { error: errorLogger }, recordsLocation: '/path/to/records.txt' },
  })
)

test('retrieves record data', (t) => {
  readFileSync.returns({ toString: () => records })

  const data = requireData()

  t.deepEqual(data.pings, [1, 2, 3])
  t.deepEqual(data.downloads, [4, 5, 6])
  t.deepEqual(data.uploads, [7, 8, 9])

  teardown()
  t.end()
})

test('logs error if the file does not exist', (t) => {
  readFileSync.throws(errorMessage)

  requireData()

  const loggedMessage = errorLogger.args[0][0]
  t.ok(includes(errorMessage, loggedMessage))

  teardown()
  t.end()
})

test('logs error if there are no records in the file', (t) => {
  readFileSync.returns({ toString: () => '' })

  requireData()

  const loggedMessage = errorLogger.args[0][0]
  t.ok(includes(errorMessage, loggedMessage))

  teardown()
  t.end()
})
