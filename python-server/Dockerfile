# global variable
ARG MR_VERSION="1.0.0"


# build environment
FROM gavin1937/emsdk-cv-wasm:4.9.0 AS build

# setup enviroments
RUN \
    apt update -y && \
    apt install -y git python3 python3-pip libpython3-dev && \
    cd "$OPENCV_BUILD" && cmake --install . --prefix install


WORKDIR /src/

ARG MR_VERSION
ARG MR_ENABLE_OPENCV_NONFREE

# download & build MoonRegistration-python
RUN git clone --depth 1 --branch "v${MR_VERSION}" https://github.com/Gavin1937/MoonRegistration.git && \
    cd MoonRegistration/platforms/python && \
    pip3 install wheel && \
    if [ "${MR_ENABLE_OPENCV_NONFREE}" = "ON" -o "${MR_ENABLE_OPENCV_NONFREE}" = "on" -o "${MR_ENABLE_OPENCV_NONFREE}" = "1" ] ; \
    then \
        python3 setup.py bdist_wheel --mr-enable-opencv-nonfree ; \
        python3 setup.py bdist_wheel --mr-enable-opencv-nonfree ; \
    else \
        python3 setup.py bdist_wheel ; \
        python3 setup.py bdist_wheel ; \
    fi



# deploy environment
FROM ubuntu:22.04

ARG MR_VERSION

RUN \
    apt update -y && \
    apt install -y python3 python3-pip

COPY --from=build /opencv/opencv-4.9.0/build/install /usr/
COPY --from=build /src/MoonRegistration/platforms/python/dist .
COPY --from=build /src/MoonRegistration/platforms/python/requirements.txt .
RUN pip3 install -r requirements.txt && \
    pip3 install "MoonRegistration-${MR_VERSION}-cp310-cp310-linux_x86_64.whl"

WORKDIR /app

COPY . .

RUN cd /app && pip3 install -r requirements.txt

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]