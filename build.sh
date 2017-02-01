#!/bin/bash

#Generate site with last update + copy js (portfolio/blog)
jekyll build

# Commit and push to dev branch
git add .
git commit -m "`date +"%d/%m/%y %H:%M:%S "`"
git push origin dev

#Generate site with last update
jekyll build
cd _site/

# Commit and push last update to master branch
git add .
git commit -m "update site `date +"%d/%m/%y %H:%M:%S "`"
git push origin gh-pages

# Purge all files in cloudflare
