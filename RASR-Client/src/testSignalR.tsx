import React, {useState} from 'react';
import {HubConnectionState} from "@microsoft/signalr";
import {useHub} from "./hooks/useHub.ts";
import {ConnectionSrCommand} from "./types.ts";
import {useClientMethod} from "./hooks/useClientMethod.ts";
import {useHubMethod} from "./hooks/useHubMethod.ts";


interface IDataToHmi{
  dataCounterAuto : number;
  dataCounterManual : number;
}

const TestSignalR : React.FC = () => {
  const [cmdSignalR, setCmdSignalR] = useState<ConnectionSrCommand>(ConnectionSrCommand.Disconnect)
  const { signalRConnection, error } = useHub("http://localhost:5000/RT", cmdSignalR);
  const [dataCounter, setDataCounter] = useState<IDataToHmi>({dataCounterAuto: 0, dataCounterManual: 0})

  const [inputCounterManual, setInputCounterManual] = useState<number>(87);

  useClientMethod(signalRConnection, "DataToHmi", (counterAuto, counterManual) => {
     setDataCounter({dataCounterAuto: counterAuto, dataCounterManual: counterManual})
  });

  const { invoke: clearCounters } = useHubMethod(signalRConnection, "CmdFromHmiClearCounters");
  const { invoke: sendCounterManualVal } = useHubMethod(signalRConnection, "CmdFromHmiSetCounterManual");

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="border-2 w-6/12" >
        <div className="p-2 border-20 flex justify-between align-middle">
          <div className="text-2xl">
            Status: {signalRConnection?.state}
          </div>
            <button className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"} onClick={
              () => signalRConnection?.state === HubConnectionState.Disconnected ?
                setCmdSignalR(ConnectionSrCommand.Connect) : setCmdSignalR(ConnectionSrCommand.Disconnect)
            }>
              { signalRConnection?.state === HubConnectionState.Disconnected ? "Connect" : "Disconnect"}
            </button>
        </div>
        {/*{JSON.stringify(dataCounter)}*/}
        <div className={"flex items-center"}>
        <div className={"flex p-2"}>
          <div className={"flex flex-col"}>
            <div className={"text-4xl"}>
              {dataCounter.dataCounterAuto}
            </div>
          </div>
        </div>

        <div className={"flex p-2"}>
          <div className={"flex flex-col"}>
            <div className={"text-4xl"}>
              {dataCounter.dataCounterManual}
            </div>
            <div className={"text-4xl"}>
              <input type="number" onChange={(e)=>(setInputCounterManual(parseInt(e.target.value)))} className={"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"}/>
            </div>
            <button className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"} onClick={() => sendCounterManualVal(inputCounterManual)}>
              Set counter Manual
            </button>
          </div>
        </div>
        <div>
          <button className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"} onClick={() => clearCounters()}>
            Initialize counters
          </button>
        </div>
          {error ?
          <div className="" >
            {error}
          </div>
            : null}
        </div>


      </div>
    </div>
  );
};

export default TestSignalR;