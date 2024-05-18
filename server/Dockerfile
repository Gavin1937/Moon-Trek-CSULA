FROM node:alpine3.17

# setup working dir & copy source code
WORKDIR /src/
COPY . .

# setup conda & build
RUN npm install


# dev deploy
# ENV NODE_ENV="dev"
# ENTRYPOINT ["npm", "run", "dev"]

# production deploy
ENV NODE_ENV="production"
ENTRYPOINT ["node", "server.js"]

EXPOSE 8888
