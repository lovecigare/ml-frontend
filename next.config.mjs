/** @type {import('next').NextConfig} */
const nextConfig = {
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/login',
  //       permanent: false,
  //     },
  //   ];
  // },
  webpack: (config) => {
    // The below are required for the cardano serialization library
    config.experiments.asyncWebAssembly = true;
    config.experiments.topLevelAwait = true;
    config.experiments.layers = true; // optional, with some bundlers/frameworks it doesn't work without

    // Important: return the modified config
    return config;
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
},
};

export default nextConfig;
