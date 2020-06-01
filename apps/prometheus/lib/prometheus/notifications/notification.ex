defmodule Prometheus.Notifications.Notification do
  use Ecto.Schema
  import Ecto.Changeset

  schema "notifications" do
    field :data, :string
    field :type, :string
    field :user_id, :id

    timestamps()
  end

  @doc false
  def changeset(notification, attrs) do
    notification
    |> cast(attrs, [:type, :user_id, :data])
    |> validate_required([:type, :user_id, :data])
  end
end
