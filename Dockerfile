FROM node:22 as web-compilation

RUN git clone https://github.com/basalt-rs/basalt /basalt

WORKDIR /basalt/client
RUN npm ci
RUN npm run build

FROM scratch as base-basalt-web
WORKDIR /web
COPY --from=web-compilation /basalt/client/out .
