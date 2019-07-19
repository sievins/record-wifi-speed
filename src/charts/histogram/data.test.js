const test = require('tape-catch')
const proxyquire = require('proxyquire').noCallThru()
const { all, equals, find, forEach, pluck, range, split } = require('ramda')

const defaultNumberOfGroups = 5

const createSpeedData = (speeds) => ({
  downloads: speeds,
  uploads: speeds,
  pings: speeds,
})

const requireData = (speedData) => (numberOfGroups) => (
  proxyquire('./data', {
    '../data': speedData,
  })(numberOfGroups)
)

test('handles small amount of data', (t) => {
  t.test('handles one speed', (st) => {
    st.plan(1)

    const data = requireData(createSpeedData([1]))(defaultNumberOfGroups)

    st.deepEqual(data.download, [{ key: '1.00 - 1.00', value: 1 }])
  })

  t.test('handles two speeds', (st) => {
    st.plan(1)

    const data = requireData(createSpeedData(([1, 2])))(defaultNumberOfGroups)

    st.deepEqual(data.download, [
      { key: '1.00 - 1.50', value: 1 },
      { key: '1.50 - 2.00', value: 1 },
    ])
  })
})

test('keys', (t) => {
  t.test('keys have 2 decimal points by default', (st) => {
    st.plan(2)

    const data = requireData(createSpeedData([1]))(defaultNumberOfGroups)

    const key = data.download[0].key
    const splitKey = split(' - ', key)
    const minDecimalsLength = split('.', splitKey[0])[1].length
    const maxDecimalsLength = split('.', splitKey[1])[1].length

    st.equal(minDecimalsLength, 2)
    st.equal(maxDecimalsLength, 2)
  })

  t.test('keys have 1 decimal point when there are 9-11 groups inclusive', (st) => {
    forEach((numberOfGroups) => {
      const data = requireData(createSpeedData(range(1, numberOfGroups + 1)))(numberOfGroups)

      const key = data.download[0].key
      const splitKey = split(' - ', key)
      const minDecimalsLength = split('.', splitKey[0])[1].length
      const maxDecimalsLength = split('.', splitKey[1])[1].length

      st.equal(minDecimalsLength, 1)
      st.equal(maxDecimalsLength, 1)
    }, [9, 10, 11])

    st.end()
  })

  t.test('keys have no decimal points when there are more than 11 groups', (st) => {
    st.plan(2)

    const data = requireData(createSpeedData(range(1, 13)))(12)

    const key = data.download[0].key
    const splitKey = split(' - ', key)
    const min = splitKey[0]
    const max = splitKey[1]

    st.notOk(find(equals('.'), min))
    st.notOk(find(equals('.'), max))
  })

  t.test('keys are in the format \'number.decimals - number.decimals\'', (st) => {
    st.plan(1)

    const data = requireData(createSpeedData([1]))(defaultNumberOfGroups)
    const key = data.download[0].key

    const format = /\d+.\d{2}\s.*\s\d+.\d{2}/
    st.ok(format.test(key))
  })
})

test('groups data', (t) => {
  t.test('creates n windows', (st) => {
    st.plan(1)

    const numberOfGroups = 9
    const data = requireData(createSpeedData((range(1, numberOfGroups + 1))))(numberOfGroups)

    st.equal(data.download.length, numberOfGroups)
  })

  t.test('windows are equally spaced', (st) => {
    st.plan(1)

    const data = requireData(createSpeedData(([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])))(defaultNumberOfGroups)

    const keys = pluck('key', data.download)
    const windowSizesEqual2 = all((key) => {
      const splitKey = split(' - ', key)
      return splitKey[1] - splitKey[0] === 2
    }, keys)

    st.ok(windowSizesEqual2)
  })

  t.test('groups unequally spread data', (st) => {
    st.plan(1)

    const data = requireData(createSpeedData(([1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])))(defaultNumberOfGroups)
    const values = pluck('value', data.download)

    st.deepEqual(values, [12, 2, 2, 2, 2])
  })

  t.test('handles windows which have no data', (st) => {
    st.plan(1)

    const data = requireData(createSpeedData(([1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 11])))(defaultNumberOfGroups)
    const values = pluck('value', data.download)

    st.deepEqual(values, [10, 0, 0, 0, 1])
  })

  t.test('groups download, upload and ping data', (st) => {
    st.plan(1)

    const data = requireData(createSpeedData(([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])))(defaultNumberOfGroups)
    const expectedData = [
      { key: '1.00 - 3.00', value: 3 },
      { key: '3.00 - 5.00', value: 2 },
      { key: '5.00 - 7.00', value: 2 },
      { key: '7.00 - 9.00', value: 2 },
      { key: '9.00 - 11.00', value: 2 },
    ]

    st.deepEqual({
      download: expectedData,
      upload: expectedData,
      ping: expectedData,
    }, data)
  })
})
