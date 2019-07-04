const ramda = require('ramda')
const { downloads, uploads, pings } = require ('../data')

const { filter, head, map, range, reduce, sort } = ramda

// Speeds example: [4.321, 2.123, 4.634]
// Histogram example: [{ key: '0-3', value: 1 }, { key: '3-6', value: 2 }]
const computeHistogram = (speeds) => {
  const sortedSpeeds = sort((a, b) => a - b, speeds)
  const first = head(sortedSpeeds)
  const last = ramda.last(sortedSpeeds)

  const numberOfGroups = 5 // TODO include this as a setting
  const windowSize = (last - first) / numberOfGroups
  const windows = map((windowMultiplier) => {
    const min = first + windowSize * windowMultiplier
    const max = first + windowSize * (windowMultiplier + 1)
    return {
      min: windowMultiplier === 0 ? 0 : min,
      max,
      key: `${min.toFixed(2)} - ${max.toFixed(2)}`,
    }
  }, range(0, numberOfGroups))

  return reduce((acc, window) => {
    const { min, max, key } = window
    const speedsInWindow = filter((speed) => (speed > min && speed <= max), sortedSpeeds)
    return acc.concat({
      key,
      value: speedsInWindow.length,
    })
  }, [], windows)
}

module.exports = {
  download: computeHistogram(downloads),
  upload: computeHistogram(uploads),
  ping: computeHistogram(pings),
}
