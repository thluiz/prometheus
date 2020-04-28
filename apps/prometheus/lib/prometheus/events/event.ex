defmodule Prometheus.Events.Event do
  use Ecto.Schema
  import Ecto.Changeset

  schema "events" do
    field :active, :boolean, default: false
    field :date, :naive_datetime
    field :title, :string

    timestamps()
  end

  @doc false
  def changeset(event, attrs) do
    event
    |> cast(attrs, [:title, :date, :active])
    |> validate_required([:title, :date, :active])
  end
end
