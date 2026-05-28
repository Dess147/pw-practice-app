import { defineConfig, devices } from '@playwright/test';
import type {TestOptions} from './test-options';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig<TestOptions>({
  timeout: 40000,
  globalTimeout: 60000,

  expect: {
    timeout: 2000,
  },

  use: {
    globalsQAURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
    baseURL: 'http://localhost:4200/'
  },

  projects: [
    {
      name: 'chromium',
    }
]  
});
