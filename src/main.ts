import { path as rootPath } from 'app-root-path';
import { resolve } from 'path';
import fs from 'fs-extra';

const generatedPath = resolve(rootPath, 'generated');
const staticPath = resolve(rootPath, 'static');

fs.ensureDirSync(generatedPath);

fs.copySync(staticPath, generatedPath);

export default null;
