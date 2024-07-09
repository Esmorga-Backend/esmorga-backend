import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    coverage: {
      // you can include other reporters, but 'json-summary' is required, json is recommended
      reporter: ['json-summary'],
      // If you want a coverage reports even if your tests are failing, include the reportOnFailure option
      reportOnFailure: true,
    },
    thresholds: {
      lines: 60,
      branches: 60,
      functions: 60,
      statements: 60,
    },
  },
});
