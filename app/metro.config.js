const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo root
config.watchFolders = [workspaceRoot];

// 2. Resolve modules from both roots and nested CLI dependencies
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules/@expo/cli/node_modules'),
];

// 3. Enable support for package 'exports' (essential for SDK 55+)
config.resolver.unstable_enablePackageExports = true;
config.resolver.disableHierarchicalLookup = false;

// 4. Map nested dependencies that are hard to resolve in Windows monorepos
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  '@expo/router-server': path.resolve(workspaceRoot, 'node_modules/@expo/cli/node_modules/@expo/router-server'),
};

config.resolver.blockList = [
  /.*[\\\/]app[\\\/]android[\\\/].*/,
  /.*[\\\/]app[\\\/]ios[\\\/].*/,
  /.*[\\\/]metro\.config\.js$/,
];

module.exports = config;
