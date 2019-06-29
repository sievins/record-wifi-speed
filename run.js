#!/usr/bin/env node

require('dotenv').config()
const recordWifiSpeed = require('./index')

// When running as an executable these variables are created from the args
// When running with node these variables are created from the environment variables
const wifiName = process.argv[2] || process.env.WIFI_NAME
const recordLocation = process.argv[3] || process.env.RECORD_LOCATION

recordWifiSpeed({ wifiName, recordLocation })
