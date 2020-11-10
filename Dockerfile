FROM ubuntu:xenial-20201014

# Upgrade existing packages
RUN apt update && apt upgrade -y

# Install core necessities
RUN apt install -y git curl

# Install Nodejs runtime
RUN curl -sL https://deb.nodesource.com/setup_15.x | bash -
RUN apt install -y nodejs

# Install tools
RUN npm install -g prettier && \
    npm install -g redoc && \
    npm install -g depcheck