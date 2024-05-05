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
BACKEND_SERVER="http://localhost:8888"
PYTHON_SERVER="http://localhost:5000"
MR_ENABLE_OPENCV_NONFREE="ON"
```

* `BACKEND_SERVER`: backend server url, do not add trailing slash /
* `PYTHON_SERVER`: python-server url, do not add trailing slash /
* `MR_ENABLE_OPENCV_NONFREE`: whether to enable MoonRegistration OpenCV non-free registration algorithm (SURF) in the project. [Learn more about the flag in this doc](https://github.com/Gavin1937/MoonRegistration/blob/main/BUILDING.md#about-opencv-versions--modules)

2. Build Docker images

```sh
docker-compose -f docker-compose.yml build
```

> **Note: every time you change something you need to rebuild modified app**

> If you don't want to deploy the project with `python-server`, you can modify `docker-compose.yml` file, and comment out `moontrek-python-server` section before building.

3. Now, you can launch the project with:

```sh
docker-compose -f docker-compose.yml up -d
```

3. You can stop the project with:

```sh
docker-compose -f docker-compose.yml down
```

## Deploy app individually

* Follow the documentation in each app

