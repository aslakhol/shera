/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  redirects: async () => {
    return [
      {
        source: "/events/71",
        destination: "/events/big-sig-p-jordal-terrasse-sgouwqfp",
        permanent: true,
      },
    ];
  },
};

export default config;
