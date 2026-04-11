import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  {
    ignores: ['**/node_modules/**', '**/.next/**', '**/build/**', '**/dist/**', '**/public/**'],
  },
  ...nextCoreWebVitals,
];

export default eslintConfig;
