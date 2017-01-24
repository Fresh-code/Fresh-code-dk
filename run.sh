#!/bin/bash
node server/get-ssh.js

cd wp-data

git config user.name "yvhenii bilyk"
git config user.email blinkme1@ukr.net
git checkout master
eval $(ssh-agent -s)
ssh-keyscan -t rsa gitlab.com >> ~/.ssh/known_hosts
chmod 400 ~/.ssh/id_rsa
ssh-add ~/.ssh/id_rsa

cd ..

git submodule init
eval $(ssh-agent -s)
ssh-add ~/.ssh/id_rsa
git submodule update

cp -rf ./wp-data/img/* ./img
cp -rf ./wp-data/_data/* ./_data
cp -rf ./wp-data/_pages/* ./_pages

jekyll build

jekyll serve -H 0.0.0.0 & node server/app.js

