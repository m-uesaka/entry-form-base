import "@testing-library/jest-dom";

// jsdom環境での設定
if (typeof global.TextEncoder === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  global.TextEncoder = require("util").TextEncoder;
}

if (typeof global.TextDecoder === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  global.TextDecoder = require("util").TextDecoder;
}

// Fetch API mock
if (typeof global.fetch === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  global.fetch = require("node-fetch");
}
