#!/usr/bin/env node

const { generateCharts } = require('./histogram')
const { environmentVariable } = require('../util')

const resultsDirectory = environmentVariable('resultsDirectory')
const numberOfGroups = Number(environmentVariable('numberOfGroups')) || undefined
generateCharts({ resultsDirectory, numberOfGroups })
