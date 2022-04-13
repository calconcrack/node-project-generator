import { load } from 'ts-dotenv';

export default load({
  NODE_ENV: [
    'example' as const,
    'development' as const,
    'test' as const,
    'production' as const,
  ],
});
