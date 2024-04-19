if (!URL.canParse(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL)) {
  throw new Error(`
    Please provide a valid WordPress instance URL.
    Add to your environment variables NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL.
  `);
}

const { protocol, hostname, port, pathname } = new URL(
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL,
);

/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: protocol.slice(0, -1),
        hostname,
        port,
        pathname: `/**`,
      },
      {
        protocol: "http",
        hostname: "1.gravatar.com",
        port: "",
        pathname: "/avatar/**",
      },
    ],
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(graphql|gql)/,
      exclude: /node_modules/,
      loader: "graphql-tag/loader",
    });

    return config;
  },
};
