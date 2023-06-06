using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using QWSR.Auxiliary;

namespace QWSR.Logics.SignalR;

public class RtHub : Hub
{
	private readonly ILogger<RtHub> _logger;
	private readonly BusData _busData;
	private readonly RtMethods _rtMethods;

	public RtHub(ILogger<RtHub> logger, BusData busData, RtMethods rtMethods)
	{
		_logger = logger;
		_busData = busData;
		_rtMethods = rtMethods;
	}

	public override Task OnConnectedAsync()
	{
		
		var newClient = new ClientConnection
		{
			IdConnection = Context.ConnectionId,
			Group = "viewer",
		};
		_busData.ClConnection.Add(Context.ConnectionId, newClient);
		Clients.Caller.SendAsync("HelloMessage", $"Hi! your connection id is: {Context.ConnectionId}");
		_logger.LogInformation("New Client with id: ${Variable} is now connected!",Context.ConnectionId);
		return base.OnConnectedAsync();
	}

	public override Task OnDisconnectedAsync(Exception? exception)
	{
		_busData.ClConnection.Remove(Context.ConnectionId);
		_logger.LogInformation("The Client with id: ${Variable} is now disconnected!",Context.ConnectionId);
		return base.OnDisconnectedAsync(exception);
	}

	public async Task CmdFromHmiGetCounters()
	{
		await _rtMethods.DataToHmi();
		await Task.CompletedTask;
	}

	public async Task CmdFromHmiClearCounters()
	{
		const bool initilize = true;
		await _rtMethods.DataToHmi(initilize);
		await Clients.All.SendAsync("Notify", $"Hi! the counters are initialized by: {Context.ConnectionId}");
		await Task.CompletedTask;
	}
	
	public async Task CmdFromHmiSetCounterManual(int data)
	{
		_busData.CounterManual = data;
		await Clients.All.SendAsync("Notify", $"Hi! the counters are initialized by: {Context.ConnectionId}");
		await Task.CompletedTask;
	}
	
	
	
}