FROM node:alpine3.17 AS build

ARG BACKEND_SERVER
ARG PYTHON_SERVER
ARG MR_ENABLE_OPENCV_NONFREE

# setup working dir & copy source code
WORKDIR /src/
COPY . .

# build
RUN npm install && \
    if [ "${MR_ENABLE_OPENCV_NONFREE}" = "ON" -o "${MR_ENABLE_OPENCV_NONFREE}" = "on" -o "${MR_ENABLE_OPENCV_NONFREE}" = "1" ] ; \
    then \
        echo '{"backend_server":"'"${BACKEND_SERVER}"'","python_server":"'"${PYTHON_SERVER}"'","MR_ENABLE_OPENCV_NONFREE":true}' > src/config/config.json ; \
    else \
        echo '{"backend_server":"'"${BACKEND_SERVER}"'","python_server":"'"${PYTHON_SERVER}"'"}' > src/config/config.json ; \
    fi && \
    npm run build


# serving built frontend with nginx
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*
COPY --from=build /src/dist .
COPY ./nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]
EXPOSE 5173