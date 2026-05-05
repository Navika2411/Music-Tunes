/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "c.saavncdn.com",
      "static.saavncdn.com",
      "www.jiosaavn.com",
      "lh3.googleusercontent.com",
      "api.dicebear.com",
      "images.jiosaavn.com",
      "jiosaavn-api-sigma-sandy.vercel.app",
    ],
  },
};

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA(nextConfig);
