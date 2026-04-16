#!/usr/bin/env node
/**
 * CLI Entry Point for DHF RPA Test Workflow
 */

import { main } from './main.js';

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
