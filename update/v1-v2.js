#!/usr/bin/env node

const readline = require('readline')
const { readFileSync, renameSync, writeFileSync } = require('fs')
const { replace } = require('ramda')

const format = (path) => {
  const contents = readFileSync(path).toString()
  const withCommas = replace(/}\n(?!$)/g, '},\n', contents)
  const withOpeningBracket = replace(/{/, '[{', withCommas)
  const withClosingBracket = replace(/}\n$/, '}]\n', withOpeningBracket)
  writeFileSync(path, withClosingBracket)
}

const rename = (oldPath) => {
  const newPath = replace(/[^\/\\]+$/, 'records.txt', oldPath)
  renameSync(oldPath, newPath)
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question('Enter the path to your record, e.g. C:\\Users\\Bob\\wifi-speed-results.txt: ', (path) => {
  format(path)
  rename(path)

  console.log('The results file has been renamed to `records.txt` and is now in JSON format.')

  rl.close()
})
