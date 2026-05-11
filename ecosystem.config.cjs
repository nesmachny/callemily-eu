// PM2: запуск Next.js на порту 3004. Запускать из каталога приложения:
//   cd /var/www/callemily.eu && pm2 startOrReload ecosystem.config.cjs --update-env
// Другие приложения в pm2 не трогаются.

module.exports = {
  apps: [
    {
      name: "callemily-eu",
      cwd: ".",
      script: "node",
      args: "node_modules/next/dist/bin/next start",
      env: {
        NODE_ENV: "production",
        PORT: 3004,
      },
      instances: 1,
      exec_mode: "fork",
    },
  ],
};
