#set the base image to Ubuntu
FROM ubuntu:14.04

# Install Node.js and other dependencies
RUN apt-get update && \
    apt-get -y install curl && \
    apt-get -y install git && \
    apt-get -y install wget && \
    apt-get -y install nano && \
    apt-get -y install vim && \
    curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash - && \
    apt-get install --yes nodejs

# Install PM2
RUN npm install -g pm2
RUN pm2 install pm2-logrotate
RUN pm2 set pm2-logrotate:max_size 100M
RUN pm2 set pm2-logrotate:rotateInterval '0 */1 * * *'
RUN pm2 set pm2-logrotate:compress true
RUN pm2 set pm2-logrotate:retain 7

RUN mkdir -p /var/www/

# Define working directory
WORKDIR /var/www/backend

ADD . /var/www/backend

RUN npm install

#COPY docker-entrypoint.sh /
#ENTRYPOINT ["/docker-entrypoint.sh"]
CMD pm2 start --no-daemon /var/www/backend/index.js --watch

