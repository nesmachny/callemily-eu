// PM2: запуск Next.js на порту 3001. Запускать из каталога приложения:
//   cd /var/www/callemily.ru && pm2 startOrReload ecosystem.config.cjs --update-env
// Другие приложения в pm2 не трогаются.

module.exports = {
  apps: [
    {
      name: "callemily",
      cwd: ".",
      script: "node",
      args: "node_modules/next/dist/bin/next start",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      instances: 1,
      exec_mode: "fork",
    },
  ],
};
