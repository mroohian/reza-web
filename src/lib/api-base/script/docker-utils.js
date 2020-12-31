#!/usr/bin/env node
const { execSync } = require('child_process');

const scriptArgIndex = process.argv.findIndex(arg => /docker-utils\.js/.test(arg));

if (scriptArgIndex < 0) {
  console.error('ERROR: Invalid script arguments provided.');
  process.exit(1);
}

const commandArgIndex = scriptArgIndex + 1;

if (commandArgIndex >= process.argv.length) {
  console.error('ERROR: docker-util command is missing.');
  process.exit(1);
}

const commandName = process.argv[commandArgIndex];

const extraParams = process.argv.slice(commandArgIndex + 1).join(' ');

const packageName = process.env['npm_package_name'];
const packageVersion = process.env['npm_package_version'];
const packageConfigDockerRegistry = process.env['npm_package_config_docker_registry'];
const packageConfigPort = process.env['npm_package_config_port'];

const image = `${packageConfigDockerRegistry}/${packageName}:${packageVersion}`;

const commands = {
  build: `docker build -t ${image} ${extraParams}`,
  run: `docker run --rm -it -p ${packageConfigPort}:${packageConfigPort} ${image} ${extraParams}`,
  push: `docker push ${image} ${extraParams}`,
};

if (!(commandName in commands)) {
  throw new Error(`Command '${commandName}' was not found`);
}

const command = commands[commandName];

console.log(command);
try {
  execSync(command, { stdio: 'inherit' });
} catch (error) {}
