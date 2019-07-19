const test = require('tape-catch')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

const requireUncached = (module) => {
  delete require.cache[require.resolve(module)]
  return require(module)
}

const sandbox = sinon.createSandbox()

test('entryPoint', (t) => {
  const { entryPoint } = requireUncached('./environment-variable')

  t.test('ignores extension', (st) => {
    st.plan(1)

    const filename = 'entry.js'
    const entry = entryPoint(filename)
    st.equal(entry, 'entry')
  })

  t.test('handles forward slashes', (st) => {
    st.plan(1)

    const filename = 'path/to/entry'
    const entry = entryPoint(filename)
    st.equal(entry, 'entry')
  })

  t.test('handles backward slashes', (st) => {
    st.plan(1)

    const filename = 'path\\to\\entry'
    const entry = entryPoint(filename)
    st.equal(entry, 'entry')
  })

  t.test('ignores index.js', (st) => {
    st.plan(1)

    const filename = 'path/to/entry/index.js'
    const entry = entryPoint(filename)
    st.equal(entry, 'entry')
  })
})

test('entryMap', (t) => {
  const teardown = () => sandbox.restore()

  t.test('run-speed-test', (st) => {
    st.test('wifiName', (rt) => {
      rt.test('returns first node arg if defined', (qt) => {
        const wifiName = 'PLUSNET-1234'
        sandbox.stub(process, 'argv').value(['node.exe', 'tape', wifiName])
        const { entryMap } = requireUncached('./environment-variable')

        const arg = entryMap['run-speed-test'].wifiName
        qt.equal(arg, wifiName)

        teardown()
        qt.end()
      })

      rt.test('returns env variable if first node arg is not defined', (qt) => {
        const wifiName = 'PLUSNET-1234'
        sandbox.stub(process, 'argv').value(['node.exe', 'tape'])
        sandbox.stub(process, 'env').value({ WIFI_NAME: wifiName })
        const { entryMap } = requireUncached('./environment-variable')

        const arg = entryMap['run-speed-test'].wifiName
        qt.equal(arg, wifiName)

        teardown()
        qt.end()
      })
    })

    st.test('resultsDirectory', (rt) => {
      rt.test('returns second node arg if defined', (qt) => {
        const resultsDirectory = '/path/to/results/directory'
        sandbox.stub(process, 'argv').value(['node.exe', 'tape', 'PLUSNET-1234', resultsDirectory])
        const { entryMap } = requireUncached('./environment-variable')

        const arg = entryMap['run-speed-test'].resultsDirectory
        qt.equal(arg, resultsDirectory)

        teardown()
        qt.end()
      })

      rt.test('returns env variable if second node arg is not defined', (qt) => {
        const resultsDirectory = '/path/to/results/directory'
        sandbox.stub(process, 'argv').value(['node.exe', 'tape'])
        sandbox.stub(process, 'env').value({ RESULTS_DIRECTORY: resultsDirectory })
        const { entryMap } = requireUncached('./environment-variable')

        const arg = entryMap['run-speed-test'].resultsDirectory
        qt.equal(arg, resultsDirectory)

        teardown()
        qt.end()
      })
    })

    st.test('modules exists', (rt) => {
      proxyquire('../speed-test/run-speed-test', {
        './speed-test': sinon.spy(),
        '../util': { environmentVariable: sinon.spy() },
      })

      rt.end()
    })
  })

  t.test('run-generate-charts', (st) => {
    st.test('resultsDirectory', (rt) => {
      rt.test('returns first node arg if defined', (qt) => {
        const resultsDirectory = '/path/to/results/directory'
        sandbox.stub(process, 'argv').value(['node.exe', 'tape', resultsDirectory])
        const { entryMap } = requireUncached('./environment-variable')

        const arg = entryMap['run-generate-charts'].resultsDirectory
        qt.equal(arg, resultsDirectory)

        teardown()
        qt.end()
      })

      rt.test('returns env variable if first node arg is not defined', (qt) => {
        const resultsDirectory = '/path/to/results/directory'
        sandbox.stub(process, 'argv').value(['node.exe', 'tape'])
        sandbox.stub(process, 'env').value({ RESULTS_DIRECTORY: resultsDirectory })
        const { entryMap } = requireUncached('./environment-variable')

        const arg = entryMap['run-generate-charts'].resultsDirectory
        qt.equal(arg, resultsDirectory)

        teardown()
        qt.end()
      })
    })

    st.test('numberOfGroups', (rt) => {
      rt.test('returns node arg if --number-of-groups option exists', (qt) => {
        const numberOfGroups = 10
        sandbox.stub(process, 'argv').value(['node.exe', 'tape', '/path/to/results/directory', '--number-of-groups', numberOfGroups])
        const { entryMap } = requireUncached('./environment-variable')

        const arg = entryMap['run-generate-charts'].numberOfGroups
        qt.equal(arg, numberOfGroups)

        teardown()
        qt.end()
      })

      rt.test('returns env variable if node arg is not defined', (qt) => {
        const numberOfGroups = 10
        sandbox.stub(process, 'argv').value(['node.exe', 'tape', '/path/to/results/directory'])
        sandbox.stub(process, 'env').value({ NUMBER_OF_GROUPS: numberOfGroups })
        const { entryMap } = requireUncached('./environment-variable')

        const arg = entryMap['run-generate-charts'].numberOfGroups
        qt.equal(arg, numberOfGroups)

        teardown()
        qt.end()
      })

      rt.test('returns undefined if node arg and env var are not defined', (qt) => {
        sandbox.stub(process, 'argv').value(['node.exe', 'tape', '/path/to/results/directory'])
        sandbox.stub(process, 'env').value({ NUMBER_OF_GROUPS: undefined })
        const { entryMap } = requireUncached('./environment-variable')

        const arg = entryMap['run-generate-charts'].numberOfGroups
        qt.equal(arg, undefined)

        teardown()
        qt.end()
      })
    })

    st.test('modules exists', (rt) => {
      proxyquire('../charts/run-generate-charts', {
        './histogram': { generateCharts: sinon.spy() },
        '../util': { environmentVariable: sinon.spy() },
      })

      rt.end()
    })
  })
})
