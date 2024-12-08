// next.config.js
module.exports = {
    images: {
      remotePatterns: [
        {
          // protocol: 'http',
          protocol: 'https',
          // hostname: 'localhost',
          hostname: 'ai-powered-website-backend.onrender.com/api',
          port: '',
          // port: '3001',
          pathname: '/images/**',
        },
      ],
    },
  }