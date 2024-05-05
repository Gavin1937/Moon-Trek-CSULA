# Moon-Trek client

Moon-Trek client, a Vue 3 frontend.


## Configuration

When deploy manually or running in development mode, you need to create a configuration file.

1. create a `config.json` file under `client/src/config/` folder
   * you can use `client/src/config/config.json.template` file as your foundation
2. here is an example configuration

```jsonc
{
    "backend_server": "http://localhost:8888",
    "python_server": "http://localhost:5000",
    "MR_ENABLE_OPENCV_NONFREE": true
}
```

* `backend_server`: backend server url, do not add trailing slash /
* `python_server`: python-server url, do not add trailing slash /
* `MR_ENABLE_OPENCV_NONFREE`: whether to enable MoonRegistration OpenCV non-free registration algorithm (SURF) in the ui. [Learn more about the flag in this doc](https://github.com/Gavin1937/MoonRegistration/blob/main/BUILDING.md#about-opencv-versions--modules)


## Deploy with Docker (Recommend)

To deploy client with Docker.

1. In directory `client`, build docker image with:

```sh
docker build \
--build-arg "backend_server=http://localhost:8888" \
--build-arg "python_server=http://localhost:5000" \
--build-arg "MR_ENABLE_OPENCV_NONFREE=ON" \
-t moontrek-client .
```

> You **must supply** `--build-arg` to docker for building the image. This is because we will use client configuration file at build time, so **you don't need to write a `config.json` file when deploy with Docker.**

> You can enable/disable OpenCV non-free registration algorithm (SURF) in the UI by setting docker build flag: `--build-arg "MR_ENABLE_OPENCV_NONFREE"` to `"ON"` or `"OFF"`. [Learn more about the flag in this doc](https://github.com/Gavin1937/MoonRegistration/blob/main/BUILDING.md#about-opencv-versions--modules)

2. Run docker container with:

```sh
docker run -d --name moontrek-client \
    -p 5173:5173 \
    moontrek-client
```

> We use argument `-p` here to export container port 5173 to host port 5173.


## Deploy manually

1. Install dependencies

```sh
npm install
```

2. Compile and Hot-Reload for Development

```sh
npm run dev
```

3. Compile and Minify for Production

```sh
npm run build
```

4. Install serve to serve the app

```sh
npm install serve
```

5. Serve the app

```sh
serve -l tcp://127.0.0.1:5173 dist
```

> Note: deploying Vue 3 application with `serve` would likely cause routing issue. (e.g. refreshing `/upload` path will return a 404)
> 
> you need to route paths who do not associate with any file to index.html, for example, `/upload` should be route to index.html
>
> References:
> 
> [https://stackoverflow.com/a/66514889](https://stackoverflow.com/a/66514889)
> 
> [https://router.vuejs.org/guide/essentials/history-mode.html#HTML5-Mode](https://router.vuejs.org/guide/essentials/history-mode.html#HTML5-Mode)
> 
> [https://router.vuejs.org/guide/essentials/history-mode.html#nginx](https://router.vuejs.org/guide/essentials/history-mode.html#nginx)
>
> It is easier to do that with a proper web server, you can use the [nginx.conf](./nginx.conf) file under `client` directory serving with nginx. [Please refer to vue.js documentation for more detail](https://router.vuejs.org/guide/essentials/history-mode.html#Example-Server-Configurations)


## Others

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

### Vite Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

