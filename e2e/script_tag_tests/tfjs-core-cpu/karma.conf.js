/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

module.exports = function(config) {
  const args = [];

  const coreBundle = config.coreBundle ? config.coreBundle : 'tf-core.min.js';
  const coreBundlePath =
      `../../node_modules/@tensorflow/tfjs-core/dist/${coreBundle}`;
  const cpuBundle =
      config.cpuBundle ? config.cpuBundle : 'tf-backend-cpu.min.js';
  const cpuBundlePath =
      `../../node_modules/@tensorflow/tfjs-backend-cpu/dist/${cpuBundle}`;

  const devConfig = {
    frameworks: ['jasmine'],
    singleRun: true,
    files: [
      {
        pattern: coreBundlePath,
        nocache: true,
      },
      {
        pattern: cpuBundlePath,
        nocache: true,
      },
      {pattern: './**/*_test.js'},
    ],
    reporters: ['progress']
  };

  const browserstackConfig =
      {...devConfig, hostname: 'bs-local.com', singleRun: true, port: 9200};

  if (config.grep) {
    args.push('--grep', config.grep);
  }
  if (config.tags) {
    args.push('--tags', config.tags);
  }

  let extraConfig = null;

  if (config.browserstack) {
    extraConfig = browserstackConfig;
  } else {
    extraConfig = devConfig;
  }

  config.set({
    ...extraConfig,
    browsers: ['Chrome'],
    browserStack: {
      username: process.env.BROWSERSTACK_USERNAME,
      accessKey: process.env.BROWSERSTACK_KEY,
      tunnelIdentifier: `e2e_script_tag_tests_${Date.now()}_${
          Math.floor(Math.random() * 1000)}`
    },
    captureTimeout: 3e5,
    reportSlowerThan: 500,
    browserNoActivityTimeout: 3e5,
    browserDisconnectTimeout: 3e5,
    browserDisconnectTolerance: 0,
    browserSocketTimeout: 1.2e5,
    customLaunchers: {
      bs_chrome_mac: {
        base: 'BrowserStack',
        browser: 'chrome',
        browser_version: 'latest',
        os: 'OS X',
        os_version: 'High Sierra'
      },
      bs_firefox_mac: {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: 'latest',
        os: 'OS X',
        os_version: 'High Sierra'
      },
      bs_safari_mac: {
        base: 'BrowserStack',
        browser: 'safari',
        browser_version: 'latest',
        os: 'OS X',
        os_version: 'Mojave'
      },
      bs_ios_12: {
        base: 'BrowserStack',
        device: 'iPhone X',
        os: 'iOS',
        os_version: '12.3',
        real_mobile: true
      },
      bs_android_10: {
        base: 'BrowserStack',
        device: 'Google Pixel 4 XL',
        os: 'android',
        os_version: '10.0',
        real_mobile: true
      },
      win_10_chrome: {
        base: 'BrowserStack',
        browser: 'chrome',
        browser_version: '101.0',
        os: 'Windows',
        os_version: '10'
      }
    },
    client: {jasmine: {random: false}, args: args}
  });
};
