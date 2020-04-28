defmodule Prometheus.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      Prometheus.Repo,
      # Start the PubSub system
      {Phoenix.PubSub, name: Prometheus.PubSub}
      # Start a worker by calling: Prometheus.Worker.start_link(arg)
      # {Prometheus.Worker, arg}
    ]

    Supervisor.start_link(children, strategy: :one_for_one, name: Prometheus.Supervisor)
  end
end
