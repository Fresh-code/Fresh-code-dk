#!/bin/bash

# Commit and push to dev branch in gitlab

git add .
git commit -m "`date +"%d/%m/%y %H:%M:%S "`"
git push gitlab-origin dev

