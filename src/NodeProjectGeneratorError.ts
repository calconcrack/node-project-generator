import chalk from 'chalk';

export class NodeProjectGeneratorError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export function nodeProjectGeneratorErrorConsoler(err: unknown) {
  if (err instanceof NodeProjectGeneratorError) {
    console.error(chalk.red(err.message));

    return;
  }

  console.error(chalk.red(err));
}

export default NodeProjectGeneratorError;

