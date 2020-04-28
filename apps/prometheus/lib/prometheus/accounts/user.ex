defmodule Prometheus.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :name, :string
    field :login, :string
    field :type, :string
    field :password_hash, :string

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name,:login, :type])
    |> validate_required([:name,:login, :type])
  end
end
