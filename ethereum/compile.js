const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');
const sourceFile = path.resolve(__dirname, 'contracts', 'Messages.sol');
const outputFile = path.resolve(buildPath, 'Messages.json');

const source = fs.readFileSync(sourceFile, 'utf8');
const compiled = solc.compile(source, 1).contracts;

fs.removeSync(buildPath);
fs.ensureDir(buildPath);
fs.writeJSONSync(outputFile, compiled[':Messages']);

