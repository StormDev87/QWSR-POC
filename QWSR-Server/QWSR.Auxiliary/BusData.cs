using Microsoft.Extensions.Logging;

namespace QWSR.Auxiliary;

public class BusData
{
	private readonly ILogger<BusData> _logger;

	public BusData(ILogger<BusData> logger)
	{
		_logger = logger;
	}
	
	public Dictionary<string, ClientConnection> ClConnection = new();
	public int CounterAuto = 0;
	public int CounterManual = 0;

}