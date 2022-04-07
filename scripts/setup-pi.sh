#!/bin/sh

sudo apt upgrade
sudo apt update

sudo apt install -y vim

# Install latest version of nodejs
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# install yarn
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | sudo tee /usr/share/keyrings/yarnkey.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn


yarn global add @nestjs/cli pm2
echo "PATH=$PATH:$(yarn global bin)" >> ~/.bashrc

# Setup SSL
sudo apt install -y snapd
sudo snap install core; sudo snap refresh core




sudo groupadd ssl-cert
sudo chgrp -R ssl-cert /etc/letsencrypt
sudo chmod -R g=rX /etc/letsencrypt

