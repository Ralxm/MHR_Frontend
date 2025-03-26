const path = require('path');

module.exports = {
  // ... other config (entry, output, etc.)
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"), // Add this line
      // Other common polyfills (you might need these later)
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "fs": false, // Disable if not needed
    }
  }
};