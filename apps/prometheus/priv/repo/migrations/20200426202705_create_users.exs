defmodule Prometheus.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :name, :string
      add :login, :string, null: false
      add :type, :string
      add :password_hash, :string

      timestamps()
    end

    create unique_index(:users, [:login])
  end
end
