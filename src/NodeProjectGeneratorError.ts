import chalk from 'chalk';

/**
 * * custom error targetting app handled error
 */
export class NodeProjectGeneratorError extends Error {
  /**
   * * constructor to initialize custom error
   * @param {string} [message] short error message
   */
  constructor(message?: string) {
    super(message);
  }
}

/**
 * * log error to console
 * @param {*} err error to be logged
 */
export function nodeProjectGeneratorErrorConsoler(err: any) {
  if (err instanceof NodeProjectGeneratorError) {
    console.error(chalk.red(err.message));

    return;
  }

  console.error(chalk.red(err));
}

export default NodeProjectGeneratorError;

