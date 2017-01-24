#!/bin/bash

#Generate site with last update + copy js (portfolio/blog)
jekyll build

# Commit and push to dev branch
git add .
git commit -m "`date +"%d/%m/%y %H:%M:%S "`"
git push origin dev



