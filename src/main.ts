import { path as rootPath } from 'app-root-path';
import { resolve } from 'path';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import NodeProjectGeneratorError, { nodeProjectGeneratorErrorConsoler } from './NodeProjectGeneratorError';

/**
 * * filesystem path to the app's 'generated' folder
 */
const generatedPath = resolve(rootPath, 'generated');

/**
 * * filesystem path to the app's 'static' folder
 */
const staticPath = resolve(rootPath, 'static');

/**
 * * main async function running the core script
 */
(async function() {
  let projectName = '';
  try {
    projectName = await inquireProjectName();
  } catch (err) {
    return;
  }

  const projectPath = resolve(generatedPath, projectName);

  try {
    await ensureProjectPath(projectPath);
  } catch (err) {
    return;
  }

  try {
    await copyToProjectPath(staticPath, projectPath);
  } catch (err) {
    return;
  }
})();

/**
 * * ask user the name of the project to be genearted
 * @return {Promise<string>} name of the project
 */
async function inquireProjectName() {
  try {
    const { projectName } = await inquirer.prompt([{
      type: 'input',
      name: 'projectName',
      message: 'What is the name of the project?',
    }]);

    if (!projectName) {
      throw new NodeProjectGeneratorError('No project name specificed');
    }

    return projectName as string;
  } catch (err) {
    nodeProjectGeneratorErrorConsoler(err);

    throw err;
  }
}

/**
 * * check if the project path exists and create if it doesn't
 * @param {string} projectPath filesystem path of the project
 */
async function ensureProjectPath(projectPath: string) {
  try {
    await fs.ensureDir(projectPath);
  } catch (err) {
    nodeProjectGeneratorErrorConsoler(err);

    throw err;
  }
}

/**
 * * copy contents of static path to the project path
 * @param {string} staticPath filesystem path of the static content
 * @param {string} projectPath filesystem path of the project
 */
async function copyToProjectPath(staticPath: string, projectPath: string) {
  try {
    await fs.copy(staticPath, projectPath);
  } catch (err) {
    nodeProjectGeneratorErrorConsoler(err);

    throw err;
  }
}

export default null;
