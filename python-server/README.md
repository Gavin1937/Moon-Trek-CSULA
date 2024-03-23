# python-server

A really simple python flask server for Moon-Trek client. The purpose of this server is to act as a backup plan for image registration. So we can have all the registration algorithm available even if client-side registration failed. And this server also unlocked algorithms thats not available in WebAssembly (SURF).


# Configure

you need to create a `config.py` file to run to server.

Use [./config/config.py.template](./config/config.py.template) as your template, and fill-in the blank.

> If you want to deploy this server via Docker, you should use [./config/config.py.docker](./config/config.py.docker) instead.

Here is a template `config.py` file

```py
CONFIG = {
    "log_filepath": "/app/data/moon-trek-python-server.log",
    "logging_level": "INFO",
    "default_rate_limits": ["20 per day"]
}
```

* `log_filepath`: path to log file
* `logging_level`: logging level. We use python logging library, check out [this article](https://docs.python.org/3/library/logging.html#logging-levels) for detail
* `default_rate_limits`: setup rate limiting, input a list of str describing rate limits. We use Flask-Limiter for a basic rate limiting, checkout [this article](https://flask-limiter.readthedocs.io/en/stable/configuration.html#ratelimit-string) for detail of this field.


# Deploying

## Deploy with Docker (Recommend)

To deploy this server with Docker:

1. Build docker image with:

```sh
docker build -t moontrek-python-server .
```

2. Run docker container with:

```sh
docker run -d --name moontrek-python-server \
    -p 5000:80 \
    -v "$(pwd)/config:/app/config" \
    moontrek-python-server
```

> Note:
> 1. we use `-p` parameter to specify the port we want to expose from container to host system. Expose container port 80 to host system port 5000. By default, docker will launch this server on container port 80.
> 2. we use `-v` to mount a volume of config file into docker container. So the server can find its `config.py` file.

## Deploy manually

To deploy this server manually:

1. [Install MoonRegistration-python package in your python environment](https://github.com/Gavin1937/MoonRegistration/blob/main/platforms/python/README.md)
    * Be sure to install the [requirements.txt](https://github.com/Gavin1937/MoonRegistration/blob/main/platforms/python/requirements.txt) for MoonRegistration-python first
2. install other requirements, they are the [requirements.txt](./requirements.txt) in current directory.

```sh
pip install -r requirements.txt
```

3. Finally, you can run the server with gunicorn:

```sh
gunicorn --bind 0.0.0.0:80 app:app
```


# Endpoints

All the endpoints in this server starts with `/api/registrar/`

### POST `/api/registrar/<algorithm>`

Run a specified registration algorithm with input images.

* Parameter:
  * `<algorithm>`: str path parameter, can be one of following:
    * SIFT
    * ORB
    * AKAZE
    * BRISK
    * SURF
  * `user-file`: form-data of user image file
  * `model-file`: form-data of model image file
* Return
  * Sample Success return json

```json
{
    "ok": true,
    "payload": {
        "homography_matrix": [
            [1, 2, 3],
            [1, 2, 3],
            [1, 2, 3]
        ]
    },
    "status": 200
}
```

* * Sample Failure return json

```json
{
    "ok": false,
    "status": 400,
    "error": "No enough keypoints for finding homography matrix"
}
```

