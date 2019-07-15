#!/usr/bin/env node

const { exec } = require('pkg')
const { resolve } = require('path')

exec([resolve(__dirname, './run-speed-test.js'), '--target', 'host', '--output', 'record-wifi-speed.exe'])
