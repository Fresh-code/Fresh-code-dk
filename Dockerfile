FROM ianwremmel/docker-node-jre

RUN gem install \
  jekyll:3.2.1 \
  jekyll-sitemap:0.11.0 \
  cmdparse:2.0.6 \
  juicer:1.2.0 \
  uglifier:3.0.1 \
  yui-compressor:0.12.0 \
  kramdown \
  rdiscount \
  rouge

RUN juicer install jslint

COPY . /src
EXPOSE 4000
WORKDIR /src
RUN jekyll build