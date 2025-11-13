import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1'
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.tests.json'
    }
  }
}

export default config