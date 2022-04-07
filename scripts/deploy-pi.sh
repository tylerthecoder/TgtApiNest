#!/bin/sh
yarn

yarn build

# start server
pm2 start -f dist/main.js --name "tgtapi"

# Autostart process on boot
pm2 startup systemd
pm2 save
