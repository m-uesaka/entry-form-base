import '@testing-library/jest-dom'

// jsdom環境での設定
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder
}

// Fetch API mock
if (typeof global.fetch === 'undefined') {
  global.fetch = require('node-fetch')
}
