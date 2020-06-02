defmodule PrometheusWeb.PageLive do
  use PrometheusWeb, :live_view

  alias Prometheus.Notifications

  @impl true
  def mount(_params, _session, socket) do
    { :ok, assign(socket, :subscribed, "undefined") }
  end

  @impl true
  def handle_event("update-subscription", %{ "subscription" => subscription, "subscribed" => subscribed }, socket) do
    socket
    |> assign(:subscription, subscription)
    |> assign(:subscribed, (if subscribed, do: "yes", else: "no"))
    |> update_notification

    { :noreply, socket }
  end

  @impl true
  def handle_event("restore-settings", %{"userkey" => userkey}, socket) do
    update_notification(socket)

    {:noreply, assign(socket, :userkey, userkey)}
  end

  def update_notification(socket) do
    if Map.has_key?(socket.assigns, :userkey) && Map.has_key?(socket.assigns, :subscription) do
      Notifications.upsert_notification(socket.assigns.userkey, "sw", socket.assigns.subscription)
    end
  end

end
