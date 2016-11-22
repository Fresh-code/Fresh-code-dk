#!/bin/bash

# Commit and push to dev branch in gitlab

eval $(ssh-agent -s)
ssh-add /.ssh/id_rsa -y

git add .
git commit -m "`date +"%d/%m/%y %H:%M:%S "`"
git push gitlab-origin dev

