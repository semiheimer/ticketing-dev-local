module.exports = {
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      poll: 300, // Set polling interval to 300ms
      ignored: /node_modules/, // Ignore node_modules directory
    };
    return config;
  },
  output: "standalone",
};
