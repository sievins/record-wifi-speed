const ramda = require('ramda')
const { downloads, uploads, pings } = require('../data')

const { filter, head, map, min, range, reduce, sort, uniq } = ramda

/**
 * A single data point for d3node-barchart
 *
 * @typedef {Object} Group
 * @property {string} key - The key which will be displayed as the x-axis value
 * @property {number} value - The number of speeds in this group, displayed as the y-axis value
 */

/**
 * computeHistogram transforms an array of speeds into data which can be consumed by d3node-barchart
 * The speed data is grouped into equally spaced windows to form a histogram
 *
 * @param {number[]} speeds - An array of speed data, e.g. [1, 4, 5]
 * @param {number} defaultNumberOfGroups - The number of groups in which to group the data into
 * @returns {Group[]} The data with which to create a histogram, e.g. [{ key: '1-3', value: 1 }, { key: '3-5', value: 2 }]
 */
const computeHistogram = (speeds, defaultNumberOfGroups) => {
  const sortedSpeeds = sort((a, b) => a - b, speeds)
  const first = head(sortedSpeeds)
  const last = ramda.last(sortedSpeeds)

  const numberOfGroups = min(uniq(speeds).length, defaultNumberOfGroups)
  const numberOfDecimals =
    numberOfGroups <= 8 ? 2 :
    numberOfGroups <= 11 ? 1 : 0

  const windowSize = (last - first) / numberOfGroups
  const windows = map((windowMultiplier) => {
    const min = first + windowSize * windowMultiplier
    const max = first + windowSize * (windowMultiplier + 1)
    return {
      min: windowMultiplier === 0 ? 0 : min,
      max,
      key: `${min.toFixed(numberOfDecimals)} - ${max.toFixed(numberOfDecimals)}`,
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

module.exports = (numberOfGroups) => ({
  download: computeHistogram(downloads, numberOfGroups),
  upload: computeHistogram(uploads, numberOfGroups),
  ping: computeHistogram(pings, numberOfGroups),
})
