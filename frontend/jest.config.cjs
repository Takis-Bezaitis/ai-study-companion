/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.test.json",
          diagnostics: {
          ignoreCodes: [1343],
        },

        astTransformers: {
          before: [
            {
              path: "node_modules/ts-jest-mock-import-meta",
              options: {
                metaObjectReplacement: {
                  env: {
                    VITE_API_URL: "http://localhost:5000",
                  },
                },
              },
            },
          ],
        },

      }
    ]
  }
};