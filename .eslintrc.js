// https://dev.to/onygami/eslint-and-prettier-for-react-apps-bonus-next-js-and-typescript-3e46

module.exports = {
    plugins: ["simple-import-sort"],
    parser: "babel-eslint",
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true
        }
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:prettier/recommended" // Make
    ],
    env: {
        browser: true,
        amd: true,
        node: true
    },
    globals: {
        window: false
    },
    settings: { react: { version: "detect" } },
    rules: {
        "prettier/prettier": ["error", { singleQuote: false }, { usePrettierrc: true }],
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "simple-import-sort/sort": "error",
        "jsx-a11y/anchor-is-valid": [
            "error",
            {
                components: ["Link"],
                specialLink: ["hrefLeft", "hrefRight"],
                aspects: ["invalidHref", "preferButton"]
            }
        ],
        "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        "jsx-quotes": [1, "prefer-double"],
        quotes: ["error", "double", { avoidEscape: true }]
    },
    overrides: [
        {
            files: ["*.ts", "*.tsx"],
            plugins: ["simple-import-sort"],
            parser: "@typescript-eslint/parser",
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true
                }
            },
            settings: {
                react: {
                    version: "detect"
                }
            },
            env: {
                browser: true,
                amd: true,
                node: true
            },
            extends: [
                "eslint:recommended",
                "plugin:@typescript-eslint/eslint-recommended",
                "plugin:@typescript-eslint/recommended",
                "plugin:react/recommended",
                "plugin:jsx-a11y/recommended",
                "prettier/@typescript-eslint",
                "plugin:prettier/recommended" // Make sure this is always the last element in the array.
            ],
            rules: {
                quotes: ["error", "double", { avoidEscape: true }],
                "prettier/prettier": ["error", { singleQuote: false }, { usePrettierrc: true }],
                "react/react-in-jsx-scope": "off",
                "react/prop-types": "off",
                "@typescript-eslint/explicit-function-return-type": "off",
                "simple-import-sort/sort": "error",
                "jsx-a11y/anchor-is-valid": [
                    "error",
                    {
                        components: ["Link"],
                        specialLink: ["hrefLeft", "hrefRight"],
                        aspects: ["invalidHref", "preferButton"]
                    }
                ],
                "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
                "@typescript-eslint/explicit-module-boundary-types": 0,
                "@typescript-eslint/no-explicit-any": 0,
                "@typescript-eslint/ban-ts-comment": 0
            }
        }
    ]
};
