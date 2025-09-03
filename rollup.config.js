import metablock from "rollup-plugin-userscript-metablock";
import terser from "@rollup/plugin-terser";

/**
 * Rollup Userscript output definitions
 */
export default [
    // Kemono Downloader
    newUserscript({
        mainFilePath: "kemono-downloader/main.js",
        metadataJSONPath: "kemono-downloader/metadata.json",
        outputFileName: "kemono-downloader.user.js",
        minify: true,
    }),
];

/**
 * Define a new Userscript
 *
 * @typedef {object} Options
 * @property {string} mainFilePath The main file path relative to the `src/userscripts` directory. Ex. `"auto-re-battle/main.js"`
 * @property {string} metadataJSONPath The metadata file path relative to the `src/userscripts` directory. Ex. `"auto-re-battle/metadata.json"`
 * @property {string} outputFileName The output file name including the .user.js file extension. Ex. `"khp-auto_re_battle.user.js"`
 * @property {boolean=} minify Whether or not to minify the output. Defaults to `false`.
 *
 * @param {Options} options
 */
function newUserscript(options) {
    const sourceBaseDir = "src";
    const outputDir = "scripts";
    const repoRawBaseURL =
        "https://github.com/FutonArizona/userscripts/raw/master";

    /** @type {import("rollup").RollupOptions} */
    const config = {
        input: `${sourceBaseDir}/${options.mainFilePath}`,
        output: {
            file: `${outputDir}/${options.outputFileName}`,
        },
    };

    config.plugins = [
        metablock({
            file: `${sourceBaseDir}/${options.metadataJSONPath}`,
            override: {
                downloadURL: `${repoRawBaseURL}/${outputDir}/${options.outputFileName}`,
                updateURL: `${repoRawBaseURL}/${outputDir}/${options.outputFileName}`,
            },
        }),
    ];

    if (options.minify) {
        config.plugins.unshift(
            terser({
                module: true,
                ecma: 2020,
                compress: true,
            }),
        );
    }

    return config;
}
