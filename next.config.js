const path = require('path');

const possible_locale = ["en", "ja", "zh"]

/** @type {import('next').NextConfig} */
const next_config = {
    reactStrictMode: true,
    pageExtensions: ["page.tsx"],
    i18n: {
        locales: possible_locale,
        defaultLocale: "en"
    },
    publicRuntimeConfig: {
        locales: possible_locale
    },
    /**
     * Disable module CSS, 
     *  from "https://stackoverflow.com/questions/67934463/how-to-turn-off-css-module-feature-in-next-js".
     */
    webpack(config)
    {
        config.module.rules.forEach(
            (rule) =>
            {
                const { oneOf } = rule;
                if (oneOf)
                {
                    oneOf.forEach((one) =>
                    {
                        if (!`${one.issuer?.and}`.includes('_app')) return;
                        one.issuer.and = [path.resolve(__dirname)];
                    });
                }
            }
        )
        return config;
    },
    // Fix the compile error, from: https://github.com/ant-design/ant-design-icons/issues/619#issuecomment-1975950167.
    transpilePackages: ["@ant-design/icons"]
}

module.exports = next_config
