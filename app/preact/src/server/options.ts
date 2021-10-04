import { sync } from 'read-pkg-up';
import { LoadOptions } from '@storybook/core-common';

export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  framework: 'preact',
  frameworkPresets: [
    require.resolve('./framework-preset-preact.js'),
    require.resolve('./framework-preset-preact-docgen.js'),
  ],
} as LoadOptions;
