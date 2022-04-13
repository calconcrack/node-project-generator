import { path as rootPath } from 'app-root-path';
import { resolve } from 'path';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import NodeProjectGeneratorError, { nodeProjectGeneratorErrorConsoler } from './NodeProjectGeneratorError';

const generatedPath = resolve(rootPath, 'generated');
const staticPath = resolve(rootPath, 'static');

(async function() {
  let projectName = '';
  try {
    projectName = await inquireProjectName();
  } catch (err) {
    return;
  }

  const projectPath = resolve(generatedPath, projectName);

  try {
    await fs.ensureDir(projectPath);
  } catch (err) {
    nodeProjectGeneratorErrorConsoler(err);

    return;
  }

  try {
    await fs.copy(staticPath, projectPath);
  } catch (err) {
    nodeProjectGeneratorErrorConsoler(err);

    return;
  }
})();

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

    return projectName;
  } catch (err) {
    nodeProjectGeneratorErrorConsoler(err);

    throw err;
  }
}

export default null;
