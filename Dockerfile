FROM bitwalker/alpine-elixir-phoenix:latest

# Set exposed ports
EXPOSE 5000
ENV PORT=5000 MIX_ENV=prod

# Cache elixir deps
ADD mix.exs mix.lock ./
RUN mix do deps.get, deps.compile

# Same with npm deps
ADD apps/prometheus_web/assets/package.json assets/
RUN cd assets && \
    npm install

ADD . .

# Run frontend build, compile, and digest assets
RUN cd apps/prometheus_web/assets/ && \
    npm run deploy && \
    cd - && \
    mix do compile, phx.digest

USER default

CMD ["mix", "phx.server"]