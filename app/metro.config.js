const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo root
config.watchFolders = [workspaceRoot];

// 2. Resolve modules from both roots
config.resolver.nodeModulesPaths = [
  projectRoot + '\\node_modules',
  workspaceRoot + '\\node_modules',
];

// 3. Disable hierarchical lookup for Windows stability
config.resolver.disableHierarchicalLookup = true;

// 4. Block only problematic infrastructure folders
config.resolver.blockList = [
  /.*[\\\/]app[\\\/]android[\\\/].*/,
  /.*[\\\/]app[\\\/]ios[\\\/].*/,
  /.*[\\\/]metro\.config\.js$/,
];

module.exports = config;
