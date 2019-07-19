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
  const labels = { xAxis: 'Speed (Mbps)', yAxis: 'Number of tests' }
  const pingLabels = { xAxis: 'Time (ms)', yAxis: 'Number of tests' }

  const downloadBarChart = d3nBar({ data: download, labels, container: container('Download speed') })
  const uploadBarChart = d3nBar({ data: upload, labels, container: container('Upload speed') })
  const pingBarChart = d3nBar({ data: ping, labels: pingLabels, container: container('Ping speed') })

  const options = { width: 960, height: 600 }

  output(resolve(chartsDirectory, './download'), downloadBarChart, options)
  output(resolve(chartsDirectory, './upload'), uploadBarChart, options)
  output(resolve(chartsDirectory, './ping'), pingBarChart, options)
}
