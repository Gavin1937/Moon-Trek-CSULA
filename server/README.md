# Moon-Trek server

Moon-Trek server, a express backend


## Configuration

You need to configure this application before running it.

1. Create a `config.json` under folder `server/api/jpl/`.
   * You can use `server/api/jpl/config.json.template` as your foundation
2. here is an example

```jsonc
{
    "dataServer": {
        "ip": "",
        "port": ""
    }
}
```


## Deploy with Docker (Recommand)

To deploy server with Docker.

1. In directory `server`, build docker image with:

```sh
docker build -t moontrek-server .
```

2. Run docker container with:

```sh
docker run -d --name moontrek-server \
    -p 8888:8888 \
    -v "$(pwd)/api/jpl:/src/api/jpl/config" \
    moontrek-server
```

> Note:
> 1. We use argument `-p` here to export container port 5173 to host port 5173.
> 2. We use argument `-v` to mount folder `server/api/jpl` to container `/src/api/jpl/config`

## Deploy manually

1. Install dependencies

```sh
npm install
```

2. Compile and Hot-Reload for Development

```sh
npm run dev
```

> You can modify `server/server.js` to change the server port

3. Run for Production

```sh
node server.js
```
