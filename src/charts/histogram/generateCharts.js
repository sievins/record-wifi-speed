const { resolve } = require('path')
const { mkdirSync } = require('fs')
const d3nBar = require('d3node-barchart')
const output = require('d3node-output')

const { download, upload, ping } = require('./data')

module.exports = ({ resultsDirectory }) => {
  const chartsDirectory = resolve(resultsDirectory, './charts')
  mkdirSync(chartsDirectory, { recursive: true })

  const options = {width: 960, height: 600}
  output(resolve(chartsDirectory, './download'), d3nBar({ data: download }), options)
  output(resolve(chartsDirectory, './upload'), d3nBar({ data: upload }), options)
  output(resolve(chartsDirectory, './ping'), d3nBar({ data: ping }), options)
}
