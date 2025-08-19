FROM node:22 AS web-compilation

COPY . .

WORKDIR /basalt/client
RUN npm ci
RUN npm run build

FROM scratch
WORKDIR /web
COPY --from=web-compilation /basalt/client/out .
