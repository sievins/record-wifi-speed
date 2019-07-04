#!/usr/bin/env node

const recordWifiSpeed = require('./speed-test')
const { environmentVariable } = require('../util')

const wifiName = environmentVariable('wifiName')
const resultsDirectory = environmentVariable('resultsDirectory')

recordWifiSpeed({ wifiName, resultsDirectory })
