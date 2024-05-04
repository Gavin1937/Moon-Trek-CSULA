FROM continuumio/miniconda3

# setup enviroments
RUN apt update -y && \
    apt install -y tzdata nodejs npm

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
