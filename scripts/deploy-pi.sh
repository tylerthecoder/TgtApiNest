#!/bin/sh
git pull

rm -rf node_modules

yarn

yarn build

# start server
pm2 start dist/main.js --name "tgtapi"

# Autostart process on boot
pm2 startup systemd
pm2 save
