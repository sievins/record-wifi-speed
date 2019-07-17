const { resolve } = require('path')
const { mkdirSync } = require('fs')
const d3nBar = require('d3node-barchart')
const output = require('d3node-output')
const { download, upload, ping } = require('./data')

module.exports = ({ resultsDirectory }) => {
  const chartsDirectory = resolve(resultsDirectory, './charts')
  mkdirSync(chartsDirectory, { recursive: true })

  const container = (title) => `
    <div id="container">
      <h2>${title}</h2>
      <div id="chart"></div>
    </div>
  `
  const options = { width: 960, height: 600 }

  const downloadBarChart = d3nBar({ data: download, container: container('Download speed') })
  const uploadBarChart = d3nBar({ data: upload, container: container('Upload speed') })
  const pingBarChart = d3nBar({ data: ping, container: container('Ping speed') })

  output(resolve(chartsDirectory, './download'), downloadBarChart, options)
  output(resolve(chartsDirectory, './upload'), uploadBarChart, options)
  output(resolve(chartsDirectory, './ping'), pingBarChart, options)
}
