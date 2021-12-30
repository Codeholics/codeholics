FROM nginx:alpine
RUN apk update && \
  apk upgrade
COPY ./output /usr/share/nginx/html
