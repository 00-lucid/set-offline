#!/usr/bin/env node

const { program } = require("commander");
const { join } = require("path");
const { execSync } = require("child_process");
const { existsSync, writeFileSync } = require("fs");
const { version } = require("../package.json");

program
  .name("ready-offline")
  .description("CLI for Automatically set ready-offline")
  .version(version);

program.command("init").action(() => {
  const yarnrcPath = join(process.cwd(), ".yarnrc");
  const yarnLockPath = join(process.cwd(), "yarn.lock");

  // yarn이 설치되어 있는지 확인
  try {
    execSync("yarn --version", { stdio: "inherit" });
  } catch (e) {
    console.log("yarn is not installed");
    return;
  }

  existsSync(yarnrcPath)
    ? console.log("yarnrc already exists")
    : writeFileSync(
        yarnrcPath,
        'yarn-offline-mirror "./npm_packages"\nyarn-offline-mirror-pruning true'
      );

  execSync("rm -rf node_modules", { stdio: "inherit" });

  if (existsSync(yarnLockPath)) {
    execSync("rm yarn.lock", { stdio: "inherit" });
    execSync("yarn cache clean", { stdio: "inherit" });
  }

  execSync("yarn install", { stdio: "inherit" });

  execSync("rm -rf node_modules", { stdio: "inherit" });
});

program.parse();
