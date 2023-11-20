# syntax = docker/dockerfile:1.4

# Build frontend
FROM ubuntu:22.04 as build-frontend
WORKDIR /app
RUN apt-get update

RUN apt-get -y install curl make gcc
RUN curl -sL https://deb.nodesource.com/setup_16.x  | bash -
RUN apt-get -y install nodejs

RUN corepack enable
RUN corepack prepare yarn@stable --activate
RUN yarn set version stable

COPY --link . .

RUN make web/install-deps
RUN make web/build

# Build backend
FROM golang:1.18 as build-backend
WORKDIR /app
COPY --link go.mod go.sum ./
RUN go mod download
COPY --link . .
COPY --link --from=build-frontend /app/web/dist /app/web/dist
RUN make bin

#Run server
FROM alpine:3.17 as hermes
COPY . .
RUN cp configs/config.hcl ./
COPY ./config.hcl ./app/config.hcl
COPY ./credentials.json ./app/credentials.json
WORKDIR /app
COPY --from=build-backend /app/hermes hermes
RUN chmod +x hermes
ENTRYPOINT ["./hermes"]