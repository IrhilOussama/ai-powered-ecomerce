// next.config.js
module.exports = {
    images: {
      remotePatterns: [
        {
          // protocol: 'http',
          protocol: 'http',
          hostname: 'localhost',
          // hostname: 'ai-powered-ecomerce.onrender.com',
          // port: '',
          port: '5000',
          pathname: '/images/**',
        },
      ],
    },
  }