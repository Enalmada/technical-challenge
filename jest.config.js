// Commented stuff below was from an old
/*
module.exports = {
  preset: "ts-jest/presets/js-with-babel",
  testEnvironment: "node",
  globals: {
    // XXX we must specify a custom tsconfig for tests because we need the typescript transform
    //  to transform jsx into js rather than leaving it jsx such as the next build requires.  you
    //  can see this setting in tsconfig.jest.json -> "jsx": "react"
    //  See https://github.com/zeit/next.js/issues/8663
    "ts-jest": {
      tsConfig: "tsconfig.jest.json"
    }
  },
  modulePathIgnorePatterns: ["cypress"],
  reporters: ["default", "jest-junit"]
};

 */

// https://medium.com/frontend-digest/setting-up-testing-library-with-nextjs-a9702cbde32d
module.exports = {
    modulePathIgnorePatterns: ["cypress"],
    setupFiles: ["./jest.setup.js"],
    testPathIgnorePatterns: [
        "<rootDir>/.next/",
        "<rootDir>/node_modules/",
        "<rootDir>/src/pages/",
        "<rootDir>/.serverless_nextjs/"
    ],
    setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
    },
    moduleNameMapper: {
        "\\.(css|sass)$": "identity-obj-proxy"
    }
};
