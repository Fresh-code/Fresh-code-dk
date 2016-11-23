#!/bin/bash

# Commit and push to dev branch in gitlab

eval $(ssh-agent -s)
chmod 400 /.ssh/id_rsa
ssh-add /.ssh/id_rsa

ssh-keyscan gitlab.com >> ~/.ssh/known_hosts

git add .
git commit -m "`date +"%d/%m/%y %H:%M:%S "`"
git push gitlab-origin dev

