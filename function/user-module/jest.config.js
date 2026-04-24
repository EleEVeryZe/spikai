module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.', // Ensures it starts looking from the project root
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  // THIS IS THE KEY PART FOR YOUR PATHS:
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
