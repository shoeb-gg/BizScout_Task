module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.', // Changed from 'src' to root
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^generated/prisma$': '<rootDir>/generated/prisma',
  },
};
