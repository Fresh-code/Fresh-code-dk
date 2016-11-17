#!/bin/bash

# Commit and push to dev branch in gitlab

ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts
eval $(ssh-agent -s)
ssh-add id_rsa

git add .
git commit -m "`date +"%d/%m/%y %H:%M:%S "`"
git push gitlab-origin dev

