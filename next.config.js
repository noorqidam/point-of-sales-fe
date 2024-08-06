const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require("next/dist/shared/lib/constants");

/** @type {import('next').NextConfig} */
const nextConfigDev = {
  reactStrictMode: true,
};

const nextConfigProd = {
  ...nextConfigDev,
  output: "standalone",
};

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return nextConfigDev;
  }

  if (phase === PHASE_PRODUCTION_BUILD) {
    return nextConfigProd;
  }

  return nextConfigProd;
};
