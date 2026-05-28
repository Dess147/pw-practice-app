import { defineConfig, devices } from '@playwright/test';
import type {TestOptions} from './test-options';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig<TestOptions>({
  timeout: 40000,
  //globalTimeout: 60000,

  expect: {
    timeout: 2000,
  },

  retries: 1,
  reporter: [
    ['json', { outputFile: 'test-results/json-report.json' }],
    ['junit', { outputFile: 'test-results/junit-report.xml' }],
    //['allure-playwright', { outputFolder: 'test-results/allure-results' }]
    ['html']
  ],

  use: {
    globalsQAURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
    baseURL: process.env.DEV === 'dev' ? 'http://localhost:4201/'
      : process.env.STAGE === 'stage' ? 'http://localhost:4202/'
      : 'http://localhost:4200/', // baseURL: 'http://localhost:4200/' by default

    trace: 'on-first-retry',
    actionTimeout: 20000,
    navigationTimeout: 5000,
    video: {
      mode: 'off',
      size: {width: 1920, height: 1080}
    }
  },

  projects: [
    {
      name: 'dev',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4201/' // 
      },
    },
    {
      name: 'chromium',
    },

    {
      name: 'firefox',
      use: { 
        browserName: 'firefox',
      },
    },
    {
      name: 'mobile',
      testMatch: '**/testMobile.spec.ts',
      use: { 
        ...devices['iPhone 13 Pro']
          // viewport: {width: 390, height: 844},
      },
    },
    {
      name: 'pageObjectsFullScreen',
      testMatch: '**/usePageObjects.spec.ts',
      use: { 
        viewport: {width: 1920, height: 1080},
      },
    }
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200/',
  },
});
