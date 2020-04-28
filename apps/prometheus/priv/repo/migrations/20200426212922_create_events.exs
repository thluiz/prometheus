defmodule Prometheus.Repo.Migrations.CreateEvents do
  use Ecto.Migration

  def change do
    create table(:events) do
      add :title, :string
      add :date, :naive_datetime
      add :active, :boolean, default: false, null: false

      timestamps()
    end

  end
end
