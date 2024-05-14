# Moon Trek CSULA

## Configuration

You need to configure individual app before launch/deploy this project.

1. [Configure client](client/README.md#configuration)
   * **You can skip this step when deploy with Docker or Docker Compose**
2. [Configure python-server](python-server/README.md#configuration)
3. [Configure server](server/README.md#configuration)


## Deploy entire project with Docker Compose (Recommend)

1. You need to create a `.env` file to configure Docker Compose
   * You can use `.env.template` as your foundation, here is an example:
```
APP_PORT=8080
BACKEND_SERVER="http://localhost:8888"
PYTHON_SERVER="http://localhost:5000"
MR_ENABLE_OPENCV_NONFREE="ON"
```

* `APP_PORT`: project application port expose to the public
  * for reverse proxy deploy only
* `BACKEND_SERVER`: backend server url, do not add trailing slash /
  * for normal deploy only
* `PYTHON_SERVER`: python-server url, do not add trailing slash /
  * for normal deploy only
* `MR_ENABLE_OPENCV_NONFREE`: whether to enable MoonRegistration OpenCV non-free registration algorithm (SURF) in the project. [Learn more about the flag in this doc](https://github.com/Gavin1937/MoonRegistration/blob/main/BUILDING.md#about-opencv-versions--modules)

2. Build Docker images

* You can use docker-compose file `docker-compose.yml` for normal deployment, this method will create multiple docker containers listenting to multiple ports

```sh
docker-compose -f docker-compose.yml build
```

* You can use docker-compose file `docker-compose-reverse-proxy.yml` for reverse proxy deployment, this method will make the project only listen to one port

```sh
docker-compose -f docker-compose-reverse-proxy.yml build
```

> **Note: every time you change something you need to rebuild modified app**

> If you don't want to deploy the project with `python-server`, you can modify `docker-compose.yml` or `docker-compose-reverse-proxy.yml` file, and comment out `moontrek-python-server` section before building.

3. Now, you can launch the project with:

* normal deployment

```sh
docker-compose -f docker-compose.yml up -d
```

* reverse proxy deployment

```sh
docker-compose -f docker-compose-reverse-proxy.yml up -d
```

4. You can stop the project with:

* normal deployment

```sh
docker-compose -f docker-compose.yml down
```

* reverse proxy deployment

```sh
docker-compose -f docker-compose-reverse-proxy.yml down
```

## Deploy app individually

* Follow the documentation in each app

