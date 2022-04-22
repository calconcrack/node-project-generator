import { path as rootPath } from 'app-root-path';
import { resolve } from 'path';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import NodeProjectGeneratorError, { nodeProjectGeneratorErrorConsoler } from './NodeProjectGeneratorError';
import { promisify } from 'util';
import { exec as execWithCallback } from 'child_process';

/**
 * * promisified exec from child_process
 */
// eslint-disable-next-line no-unused-vars
const exec = promisify(execWithCallback);

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
  let projectDetails: IProjectDetails;
  try {
    projectDetails = await inquireProjectDetails();
  } catch (err) {
    return;
  }

  const projectDetailsExtended: IProjectDetailsExtended = {
    ...projectDetails,
    path: resolve(generatedPath, projectDetails.name),
  };

  try {
    await ensureProjectPath(projectDetailsExtended.path);
  } catch (err) {
    return;
  }

  try {
    await copyToProjectPath(staticPath, projectDetailsExtended.path);
  } catch (err) {
    return;
  }

  try {
    await generatePackageJson(projectDetailsExtended);
  } catch (err) {
    return;
  }

  try {
    await installPackages(projectDetailsExtended);
  } catch (err) {
    return;
  }
})();

/**
 * * ask user the details of the project to be generated
 * @return {Promise<IProjectDetails>} name of the project
 */
async function inquireProjectDetails() {
  try {
    const projectDetails: IProjectDetails = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'name?',
      },
      {
        type: 'input',
        name: 'version',
        message: 'version?',
        default: '0.1.0',
      },
      {
        type: 'input',
        name: 'description',
        message: 'description?',
      },
      {
        type: 'input',
        name: 'author',
        message: 'author?',
      },
      {
        type: 'input',
        name: 'license',
        message: 'license?',
      },
    ]);

    if (!projectDetails.name) {
      throw new NodeProjectGeneratorError('no project name specificed');
    }

    return projectDetails;
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
    const projectPathExists = await fs.pathExists(projectPath);

    if (projectPathExists) {
      throw new NodeProjectGeneratorError('project already exists at current path');
    }

    await fs.mkdirp(projectPath);
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

/**
 * * generate package.json at project path
 * @param {IProjectDetailsExtended} projectDetailsExtended project details required with extra fields
 */
async function generatePackageJson(projectDetailsExtended: IProjectDetailsExtended) {
  const packageJSONPath = resolve(projectDetailsExtended.path, 'package.json');

  const packageJSONContent = {
    ...projectDetailsExtended,
    path: undefined,
    main: './src/index.ts',
    scripts: {
      'dev': 'ts-node ./src/index.ts',
      'build': 'tsc',
      'start': 'node ./dist/index.js',
    },
  };

  try {
    await fs.createFile(packageJSONPath);
    await fs.appendFile(packageJSONPath, JSON.stringify(packageJSONContent, null, 2));
  } catch (err) {
    nodeProjectGeneratorErrorConsoler(err);

    throw err;
  }
}

/**
 * * install npm packages
 * @param {IProjectDetailsExtended} projectDetailsExtended project details required with extra fields
 * todo: complete proper implementation
 */
async function installPackages(projectDetailsExtended: IProjectDetailsExtended) {
  try {
    await exec(`cd ${projectDetailsExtended.path}`);
    await Promise.allSettled([
      exec('npm i -D @types/app-root-path @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-google ts-node typescript'),
      exec('npm i app-root-path chalk ts-dotenv'),
    ]);
  } catch (err) {
    nodeProjectGeneratorErrorConsoler(err);

    throw err;
  }
}

export default null;

export interface IProjectDetails {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
}

export interface IProjectDetailsExtended extends IProjectDetails {
  path: string;
}
