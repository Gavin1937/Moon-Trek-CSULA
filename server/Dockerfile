FROM node:alpine3.17

# setup working dir & copy source code
WORKDIR /src/
COPY . .

# setup conda & build
RUN npm install


# dev deploy
# ENTRYPOINT ["npm", "run", "dev"]
# production deploy
ENTRYPOINT ["node", "server.js"]

EXPOSE 8888
