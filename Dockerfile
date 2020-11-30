FROM ubuntu:bionic-20200921

# Upgrade existing packages
RUN apt update && apt upgrade -y

# Install core necessities
RUN apt update && apt install -y git curl make mysql-client

# Install Nodejs runtime
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt update && apt install -y nodejs

# Install tools
RUN apt update && apt install -y openjdk-11-jre
RUN npm install -g prettier && \
    npm install -g redoc-cli && \
    npm install -g @redocly/openapi-cli && \
    npm install -g @openapitools/openapi-generator-cli -g && \
    npm install -g depcheck