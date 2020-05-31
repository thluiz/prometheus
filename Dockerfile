FROM elixir:latest-alpine as build

ENV MIX_ENV=prod

WORKDIR /build

RUN apk add --no-cache build-base nodejs yarn && \
    mix local.hex --force && \
    mix local.rebar --force

COPY mix.exs mix.lock config/ ./
COPY apps/web/mix.exs ./apps/web/
COPY apps/database/mix.exs ./apps/database/

RUN mix deps.get --only prod && \
    mix deps.compile

COPY . .

RUN yarn --cwd apps/prometheus_web/assets install --pure-lockfile && \
    yarn --cwd apps/prometheus_web/assets deploy && \
    cd apps/web && mix phx.digest

RUN mix release

FROM elixir:1.9.1-alpine

RUN addgroup -S release && \
    adduser -S -G release release && \
    mkdir /release && \
    chown -R release: /release

WORKDIR /release

COPY --from=build --chown=release:release /build/_build/prod/rel/prometheus .

USER release
EXPOSE 4000

CMD ["bin/prometheus", "start"]