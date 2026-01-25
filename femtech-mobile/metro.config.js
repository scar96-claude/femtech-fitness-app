const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Block resolving from parent directory's node_modules
// This prevents Prisma (backend-only) from being bundled
config.resolver.blockList = [
  // Block the parent's node_modules
  new RegExp(`${workspaceRoot}/node_modules/.*`),
  // Block the parent's src folder
  new RegExp(`${workspaceRoot}/src/.*`),
  // Block prisma folder
  new RegExp(`${workspaceRoot}/prisma/.*`),
];

// Only resolve from this project's node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
];

// Ensure we only watch the mobile project
config.watchFolders = [projectRoot];

module.exports = config;
