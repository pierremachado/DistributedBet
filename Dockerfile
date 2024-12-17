FROM node:18-alpine

WORKDIR /app 

COPY . .

RUN npm install && \
    npm install --save-dev hardhat && \
    npx hardhat compile && \
    npx hardhat test

EXPOSE 8545