const test = require('tape-catch')
const proxyquire = require('proxyquire').noCallThru()
const { all, pluck, split } = require('ramda')

const createSpeedData = (speeds) => ({
  downloads: speeds,
  uploads: speeds,
  pings: speeds,
})

const requireData = (speedData) => (
  proxyquire('./data', {
    '../data': speedData,
  })
)

test('handles one speed', (t) => {
  t.plan(1)

  const data = requireData(createSpeedData([1]))

  t.deepEqual(data.download, [{ key: '1.00 - 1.00', value: 1 }])
})

test('handles two speeds', (t) => {
  t.plan(1)

  const data = requireData(createSpeedData(([1, 2])))

  t.deepEqual(data.download, [
    { key: '1.00 - 1.50', value: 1 },
    { key: '1.50 - 2.00', value: 1 },
  ])
})

test('keys have 2 decimal points', (t) => {
  t.plan(2)

  const data = requireData(createSpeedData([1]))

  const key = data.download[0].key
  const splitKey = split(' - ', key)
  const minDecimalsLength = split('.', splitKey[0])[1].length
  const maxDecimalsLength = split('.', splitKey[1])[1].length

  t.equal(minDecimalsLength, 2)
  t.equal(maxDecimalsLength, 2)
})

test('keys are in the format \'number.2decimals - number.2decimals\'', (t) => {
  t.plan(1)

  const data = requireData(createSpeedData([1]))
  const key = data.download[0].key

  const format = /\d+.\d{2}\s.*\s\d+.\d{2}/
  t.ok(format.test(key))
})

test('creates 5 windows', (t) => {
  t.plan(1)

  const data = requireData(createSpeedData(([1, 2, 3, 4, 5, 6, 7, 8, 9])))

  t.equal(data.download.length, 5)
})

test('windows are equally spaced', (t) => {
  t.plan(1)

  const data = requireData(createSpeedData(([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])))

  const keys = pluck('key', data.download)
  const windowSizesEqual2 = all((key) => {
    const splitKey = split(' - ', key)
    return splitKey[1] - splitKey[0] === 2
  }, keys)

  t.ok(windowSizesEqual2)
})

test('groups unequally spread data', (t) => {
  t.plan(1)

  const data = requireData(createSpeedData(([1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])))
  const values = pluck('value', data.download)

  t.deepEqual(values, [12, 2, 2, 2, 2])
})

test('handles windows which have no data', (t) => {
  t.plan(1)

  const data = requireData(createSpeedData(([1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 11])))
  const values = pluck('value', data.download)

  t.deepEqual(values, [10, 0, 0, 0, 1])
})

test('groups download, upload and ping data', (t) => {
  t.plan(1)

  const data = requireData(createSpeedData(([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])))
  const expectedData = [
    { key: '1.00 - 3.00', value: 3 },
    { key: '3.00 - 5.00', value: 2 },
    { key: '5.00 - 7.00', value: 2 },
    { key: '7.00 - 9.00', value: 2 },
    { key: '9.00 - 11.00', value: 2 },
  ]

  t.deepEqual({
    download: expectedData,
    upload: expectedData,
    ping: expectedData,
  }, data)
})
