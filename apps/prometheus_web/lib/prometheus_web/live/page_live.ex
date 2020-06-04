defmodule PrometheusWeb.PageLive do
  use PrometheusWeb, :live_view

  alias Prometheus.Notifications

  @timezone_default "America/Sao_Paulo"

  @impl true
  def mount(_params, _session, socket) do
    if connected?(socket), do: Process.send_after(self(), :update, 30000)

    socket = socket
              |> assign(:weekday, get_week_day())
              |> assign(:subscribed, "undefined")
              |> assign(:timezone, @timezone_default)

    { :ok,  socket }
  end

  @impl true
  def handle_event("update-subscription", %{ "subscription" => subscription, "subscribed" => subscribed }, socket) do
    socket = socket
              |> assign(:subscription, subscription)
              |> assign(:subscribed, (if subscribed, do: "yes", else: "no"))

    update_notification(socket)

    { :noreply, socket }
  end

  @impl true
  def handle_event("restore-settings", %{"userkey" => userkey, "timezone" => timezone}, socket) do
    update_notification(socket)

    socket = socket
              |> assign(:userkey, userkey)
              |> assign(:timezone, timezone)
              |> assign(:weekday, get_week_day(timezone))

    {:noreply, assign(socket, :userkey, userkey)}
  end

  def handle_info(:update, socket) do
    Process.send_after(self(), :update, 30000)

    socket = socket
              |> assign(:weekday, get_week_day(socket.assigns.timezone))

    {:noreply, socket}
  end


  defp update_notification(socket) do
    if Map.has_key?(socket.assigns, :userkey) && Map.has_key?(socket.assigns, :subscription) do
      Notifications.upsert_notification(socket.assigns.userkey, "sw", socket.assigns.subscription)
    end
  end

  defp get_week_day(current_timezone  \\ "") do
    timezone = if current_timezone == "", do: @timezone_default, else: current_timezone

    { result, %DateTime{ :year => year, :month => month, :day => day } } = DateTime.now(timezone)
    :calendar.day_of_the_week(year, month, day)
  end

end
