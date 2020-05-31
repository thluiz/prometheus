FROM elixir:1.10.2-alpine as build

ENV MIX_ENV=prod

WORKDIR /build

ENV DATABASE_URL ${DATABASE_URL}
ENV SECRET_KEY_BASE ${SECRET_KEY_BASE}

RUN apk add --no-cache build-base nodejs yarn && \
    mix local.hex --force && \
    mix local.rebar --force

COPY mix.exs mix.lock config/ ./
COPY apps/prometheus_web/mix.exs ./apps/prometheus_web/
COPY apps/prometheus/mix.exs ./apps/prometheus/

RUN mix deps.get --only prod && \
    mix deps.compile

COPY . .

RUN yarn --cwd apps/prometheus_web/assets install --pure-lockfile && \
    yarn --cwd apps/prometheus_web/assets deploy && \
    cd apps/prometheus_web && mix phx.digest

RUN mix release

FROM elixir:1.10.2-alpine

RUN addgroup -S release && \
    adduser -S -G release release && \
    mkdir /release && \
    chown -R release: /release

WORKDIR /release

COPY --from=build --chown=release:release /build/_build/prod/rel/production/bin/production .

USER release
EXPOSE 4000

CMD ["bin/prometheus", "start"]