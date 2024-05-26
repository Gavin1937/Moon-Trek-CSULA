# global variable
ARG MR_VERSION="1.0.3"
ARG OPENCV_DIR="/cache/opencv"


# build environment
FROM debian:stable AS build

SHELL ["/bin/bash", "-c"]

# setup enviroments
RUN \
    apt update -y && \
    apt install -y git python3 python3-pip python3-venv libpython3-dev cmake make gcc g++ wget unzip


WORKDIR /src/

ARG MR_VERSION
ARG MR_ENABLE_OPENCV_NONFREE
ARG OPENCV_DIR

# download & build MoonRegistration-python
RUN wget https://github.com/Gavin1937/arc-opencv/releases/download/4.9.0/opencv-490-deb64-gcc-glibc.zip && \
    mkdir -p ${OPENCV_DIR} && unzip -x opencv-490-deb64-gcc-glibc.zip -d ${OPENCV_DIR} && OpenCV_DIR="${OPENCV_DIR}" && \
    git clone --depth 1 --branch "v${MR_VERSION}" https://github.com/Gavin1937/MoonRegistration.git && \
    cd MoonRegistration/platforms/python && python3 -m venv .venv && source .venv/bin/activate && \
    pip3 install wheel setuptools && \
    if [ "${MR_ENABLE_OPENCV_NONFREE}" = "ON" -o "${MR_ENABLE_OPENCV_NONFREE}" = "on" -o "${MR_ENABLE_OPENCV_NONFREE}" = "1" ] ; \
    then \
        python3 setup.py bdist_wheel --mr-enable-opencv-nonfree --cmake-arguments="-DOPENCV_DIR=$OpenCV_DIR"; \
        python3 setup.py bdist_wheel --mr-enable-opencv-nonfree --cmake-arguments="-DOPENCV_DIR=$OpenCV_DIR"; \
    else \
        python3 setup.py bdist_wheel --cmake-arguments="-DOPENCV_DIR=$OpenCV_DIR"; \
        python3 setup.py bdist_wheel --cmake-arguments="-DOPENCV_DIR=$OpenCV_DIR"; \
    fi



# deploy environment
FROM debian:stable-slim

ARG MR_VERSION
ARG OPENCV_DIR

SHELL ["/bin/bash", "-c"]

RUN \
    apt update -y && \
    apt install -y python3 python3-pip python3-venv && \
    python3 -m venv /venv

ENV PATH="/venv/bin:$PATH"

COPY --from=build \
    ${OPENCV_DIR}/lib/libopencv_core.so \
    ${OPENCV_DIR}/lib/libopencv_flann.so \
    ${OPENCV_DIR}/lib/libopencv_calib3d.so \
    ${OPENCV_DIR}/lib/libopencv_imgcodecs.so \
    ${OPENCV_DIR}/lib/libopencv_imgproc.so \
    ${OPENCV_DIR}/lib/libopencv_features2d.so \
    ${OPENCV_DIR}/lib/libopencv_xfeatures2d.so \
    /usr/lib
COPY --from=build /src/MoonRegistration/platforms/python/dist .
COPY --from=build /src/MoonRegistration/platforms/python/requirements.txt .
RUN ln -s /usr/lib/libopencv_core.so /lib/libopencv_core.so.409 && \
    ln -s /usr/lib/libopencv_flann.so /lib/libopencv_flann.so.409 && \
    ln -s /usr/lib/libopencv_calib3d.so /lib/libopencv_calib3d.so.409 && \
    ln -s /usr/lib/libopencv_imgcodecs.so /lib/libopencv_imgcodecs.so.409 && \
    ln -s /usr/lib/libopencv_imgproc.so /lib/libopencv_imgproc.so.409 && \
    ln -s /usr/lib/libopencv_features2d.so /lib/libopencv_features2d.so.409 && \
    ln -s /usr/lib/libopencv_xfeatures2d.so /lib/libopencv_xfeatures2d.so.409 && \
    if [ "${MR_ENABLE_OPENCV_NONFREE}" = "ON" -o "${MR_ENABLE_OPENCV_NONFREE}" = "on" -o "${MR_ENABLE_OPENCV_NONFREE}" = "1" ] ; \
    then \
        ln -s /usr/lib/libopencv_xfeatures2d.so /lib/libopencv_xfeatures2d.so.409 ; \
    else \
        rm /usr/lib/libopencv_xfeatures2d.so ; \
    fi && \
    pip3 install -r requirements.txt && \
    pip3 install *.whl && \
    rm /*.whl && rm /requirements.txt

WORKDIR /app

COPY . .

RUN cd /app && pip3 install -r requirements.txt

EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]