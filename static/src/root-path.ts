import {resolve} from 'path';

const currentPath = resolve(__dirname);

const nodeModulesIndex = currentPath.indexOf('/node_modules');

export const rootPath = (nodeModulesIndex === -1) ?
currentPath.substring(0, currentPath.lastIndexOf('/')) :
currentPath.substring(0, nodeModulesIndex);

export const rootFolder = rootPath.substring(rootPath.lastIndexOf('/') + 1);

export default rootPath;
