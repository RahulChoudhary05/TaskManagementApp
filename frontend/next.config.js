/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  webpack: (config, { isServer, dev }) => {
    const webpack = require('webpack');
    
    // Ignore certain modules to avoid issues with Firebase
    if (!isServer) {
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^(fs|net|tls)$/,
        })
      );

      // Also handle undici by excluding it from the client bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        path: false,
        crypto: false,
        stream: false,
        buffer: false,
        os: false,
        util: false,
        http2: false,
        worker_threads: false,
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;
