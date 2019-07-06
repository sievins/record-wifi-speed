#!/usr/bin/env node

const { generateCharts } = require('./histogram')
const { environmentVariable } = require('../util')

const resultsDirectory = environmentVariable('resultsDirectory')
generateCharts({ resultsDirectory })
