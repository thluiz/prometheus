defmodule Prometheus.Repo do
  use Ecto.Repo,
    otp_app: :prometheus,
    adapter: Ecto.Adapters.Postgres
end
