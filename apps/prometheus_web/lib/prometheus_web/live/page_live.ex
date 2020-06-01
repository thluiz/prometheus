defmodule PrometheusWeb.PageLive do
  use PrometheusWeb, :live_view

  @impl true
  def mount(_params, _session, socket) do
    { :ok, assign(socket, :subscribed, "undefined") }
  end

  @impl true
  def handle_event("update-subscription", %{ "subscription" => subscription, "subscribed" => subscribed }, socket) do
    { :noreply, assign(socket, :subscribed, (if subscribed, do: "yes", else: "no") ) }
  end

  @impl true
  def handle_event("restore-settings", %{"userkey" => userkey}, socket) do
    {:noreply, assign(socket, userkey: userkey)}
  end

end
