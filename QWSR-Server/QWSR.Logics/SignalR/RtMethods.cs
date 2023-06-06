using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using QWSR.Auxiliary;

namespace QWSR.Logics.SignalR;

public class RtMethods
{
	private readonly IHubContext<RtHub> _hubContext;
	private readonly ILogger<RtMethods> _logger;
	private readonly BusData _busData;

	public RtMethods(ILogger<RtMethods> logger, IHubContext<RtHub> hubContext, BusData busData)
	{
		_logger = logger;
		_hubContext = hubContext;
		_busData = busData;
	}
	
	public async Task DataToHmi(CancellationToken token)
	{
		await _hubContext.Clients.All.SendAsync("DataToHmi", _busData.CounterAuto, _busData.CounterManual, cancellationToken: token);
	}
	
	public async Task DataToHmi()
	{
		await _hubContext.Clients.All.SendAsync("DataToHmi", _busData.CounterAuto, _busData.CounterManual);
	}
	
	public async Task DataToHmi(bool clearCounter)
	{
		if (clearCounter)
			_busData.CounterAuto = _busData.CounterManual = 0;
		await _hubContext.Clients.All.SendAsync("DataToHmi", _busData.CounterAuto, _busData.CounterManual);
	}
	
}