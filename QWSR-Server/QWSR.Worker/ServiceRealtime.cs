using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using QWSR.Auxiliary;
using QWSR.Logics.SignalR;

namespace QWSR.Worker;


public class ServiceRealtime : BackgroundService
{
	private readonly ILogger<ServiceRealtime> _logger;
	private readonly BusData _busData;
	private readonly IHubContext<RtHub> _hubContext;
	private readonly RtMethods _rtMethods;

	public ServiceRealtime(ILogger<ServiceRealtime> logger, BusData busData, IHubContext<RtHub> hubContext, RtMethods rtMethods)
	{
		_logger = logger;
		_busData = busData;
		_hubContext = hubContext;
		_rtMethods = rtMethods;
	}
	
	protected override async Task ExecuteAsync(CancellationToken stoppingToken)
	{
		while (!stoppingToken.IsCancellationRequested)
		{
			await Task.Delay(1000, stoppingToken);
			_busData.CounterAuto++;
			await _rtMethods.DataToHmi(stoppingToken);
			_logger.LogDebug("Counter automatic is: {Variable}", _busData.CounterAuto);
			Console.WriteLine("Counter automatic is: " + _busData.CounterAuto);
		}
	}
}