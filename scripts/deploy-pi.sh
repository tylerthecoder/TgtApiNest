#!/bin/sh

git pull

rm -rf node_modules dist

yarn

yarn build

pm2 start dist/main.js --name "tgtapi"

# Autostart process on boot
pm2 startup systemd
pm2 save
