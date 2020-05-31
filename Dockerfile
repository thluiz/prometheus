FROM elixir:1.10.3-alpine as asset-builder-mix-getter

ENV HOME=/opt/app
WORKDIR $HOME

RUN mix do local.hex --force, local.rebar --force

COPY config/ ./config/
COPY mix.exs mix.lock ./

RUN mix deps.get

############################################################
FROM node:12.16.2 as asset-builder

ENV HOME=/opt/app
WORKDIR $HOME

# COPY --from=asset-builder-mix-getter $HOME/deps $HOME/deps

WORKDIR $HOME/assets
COPY assets/ ./
RUN npm install
RUN ./node_modules/webpack/bin/webpack.js --mode="production"

############################################################
FROM elixir:1.10.3-alpine

ENV HOME=/opt/app
WORKDIR $HOME

RUN mix do local.hex --force, local.rebar --force

COPY config/ $HOME/config/
COPY mix.exs mix.lock $HOME/

COPY lib/ ./lib

COPY priv/ ./priv

ENV MIX_ENV=prod

RUN mix do deps.get --only $MIX_ENV, deps.compile, compile

COPY --from=asset-builder $HOME/priv/static/ $HOME/priv/static/

RUN mix phx.digest

CMD ["mix", "phx.server"]
