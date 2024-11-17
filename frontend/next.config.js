// next.config.js
module.exports = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'ai-powered-ecomerce.onrender.com',
          port: '',
          pathname: '/images/**',
        },
      ],
    },
  }