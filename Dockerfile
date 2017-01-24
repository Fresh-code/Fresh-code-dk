FROM blinkme1/jekyll-java-node

COPY . /src
RUN mkdir -p ~/.ssh && touch ~/.ssh/known_hosts
WORKDIR /src/server
RUN npm install
WORKDIR /src
ENTRYPOINT ["./run.sh"]
