#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class MCPServerManager {
  constructor() {
    this.serverProcess = null;
    this.isRunning = false;
    this.restartCount = 0;
    this.maxRestarts = 3;
  }

  start() {
    if (this.isRunning) {
      console.log('MCP server is already running');
      return;
    }

    console.log('Starting MCP server...');
    
    const serverPath = join(__dirname, 'dist', 'server.js');
    
    this.serverProcess = spawn('node', [serverPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: process.cwd(),
      env: { ...process.env, NODE_ENV: 'production' }
    });

    this.serverProcess.stdout.on('data', (data) => {
      console.log(`MCP Server: ${data.toString().trim()}`);
    });

    this.serverProcess.stderr.on('data', (data) => {
      console.error(`MCP Server Error: ${data.toString().trim()}`);
    });

    this.serverProcess.on('close', (code) => {
      console.log(`MCP server process exited with code ${code}`);
      this.isRunning = false;
      
      if (code !== 0 && this.restartCount < this.maxRestarts) {
        console.log(`Restarting MCP server... (attempt ${this.restartCount + 1}/${this.maxRestarts})`);
        this.restartCount++;
        setTimeout(() => this.start(), 2000);
      } else if (this.restartCount >= this.maxRestarts) {
        console.error('Max restart attempts reached. MCP server failed to start.');
        process.exit(1);
      }
    });

    this.serverProcess.on('error', (error) => {
      console.error('Failed to start MCP server:', error);
      this.isRunning = false;
    });

    this.isRunning = true;
    this.restartCount = 0;

    // Graceful shutdown
    process.on('SIGINT', () => this.shutdown());
    process.on('SIGTERM', () => this.shutdown());
  }

  shutdown() {
    console.log('Shutting down MCP server manager...');
    if (this.serverProcess) {
      this.serverProcess.kill('SIGTERM');
    }
    process.exit(0);
  }

  restart() {
    console.log('Restarting MCP server...');
    if (this.serverProcess) {
      this.serverProcess.kill('SIGTERM');
    }
    setTimeout(() => this.start(), 1000);
  }
}

// Start server manager
const manager = new MCPServerManager();
manager.start();

// Health check every 30 seconds
setInterval(() => {
  if (!manager.isRunning) {
    console.log('MCP server not running, attempting restart...');
    manager.restart();
  }
}, 30000);
