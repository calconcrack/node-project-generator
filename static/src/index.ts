(async function() {
  const {default: env} = await import('./env');

  if (env.NODE_ENV === 'example') {
    console.log('loaded env is only an example');
    console.log('copy-Paste the appropriate .env.* file\'s contents to .env');

    return;
  }

  await import('./root-path');

  import('./main');
})();
