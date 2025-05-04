import createNextIntlPlugin from "next-intl/plugin";

import type { NextConfig } from "next";

// Create the next-intl plugin
const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

// Define the Next.js configuration
const nextConfig: NextConfig = {};

// Apply next-intl plugin
export default withNextIntl(nextConfig);
