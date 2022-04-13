import chalk from 'chalk';

(async function() {
  const { default: env } = await import('./env');

  if (env.NODE_ENV === 'example') {
    console.error(chalk.red('loaded env is only an example'));
    console.error(chalk.red('copy-Paste the appropriate .env.* file\'s contents to .env'));

    return;
  }

  import('./main');
})();
