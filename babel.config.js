module.exports = function (api) {
    api.cache(true);
    const presets = ["next/babel"];

    // Compile queries at build time
    const plugins = ["graphql-tag"];

    return {
        presets,
        plugins
    };
};
