import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {ConnectionSrCommand, ConnectionSrStatus} from "~/types/signalr";
import {noSerialize, NoSerialize, useSignal, $, useVisibleTask$, QRL, Signal} from "@builder.io/qwik";

interface IDataToHmi{
  dataCounterAuto : number;
  dataCounterManual : number;
}

export type UseHub = {
  signalRConnection?: NoSerialize<HubConnection>;
  statusConnection : string;
  connect?: QRL<() => void>;
  disconnect?: QRL<() => void>;
  enableRead?: QRL<() => void>;
  counters?: Signal<IDataToHmi>;
};

export function useHub(urlSignalR: string, command: ConnectionSrCommand){

  const signalTrigger = useSignal<number>(command);
  const signalUrl = useSignal<string>(urlSignalR);
  const counters = useSignal<IDataToHmi>({dataCounterAuto: 0, dataCounterManual: 0});
  const sigStatusConnection = useSignal<number>(ConnectionSrStatus.Disconnected);

  const sr = useSignal<NoSerialize<HubConnection>>();

  const createHubConnection = $(async () => {
    sr.value = noSerialize(new HubConnectionBuilder()
      .withUrl(urlSignalR)
      .withAutomaticReconnect()
      .build());
  });

  useVisibleTask$(async (ctx) => {
    console.log("useTask Create Hub Connection!");
    ctx.track(() => signalUrl.value);
    await createHubConnection();
  });

  const connect = $(async() => {
    signalTrigger.value = ConnectionSrCommand.Connect;
    console.log("connect!");
    await sr?.value?.start()
      .then(()=> {
        console.log(sr?.value?.state);
        sigStatusConnection.value = ConnectionSrStatus.Connected;
        sr?.value?.on("DataToHmi", $((counterAuto: number, counterManual : number) => {
          counters.value = {dataCounterAuto: counterAuto, dataCounterManual: counterManual}}));
        console.log("Enable read counters...");
      })
      .catch(reason => {
        console.log(reason)
      });
  });

  const disconnect = $(async () => {

    signalTrigger.value = ConnectionSrCommand.Disconnect;
    console.log("Disconnect!");
    await sr?.value?.stop()
      .then(()=> {
        console.log(sr?.value?.state);
        sigStatusConnection.value = ConnectionSrStatus.Disconnected;
      })
      .catch(reason => {
        console.log(reason)
      });
  });

  const enableRead = $( () => {
    sr?.value?.on("DataToHmi", $((counterAuto: number, counterManual : number) => {
      counters.value = {dataCounterAuto: counterAuto, dataCounterManual: counterManual}}));
    console.log("Enable read counters...");
  });

  const enableReadSync = ( () => {
    sr?.value?.on("DataToHmi", $((counterAuto: number, counterManual : number) => {
      counters.value = {dataCounterAuto: counterAuto, dataCounterManual: counterManual}}));
    console.log("Enable read counters...");
  });

  return {
    signalRConnection: sr.value,
    statusConnection : sigStatusConnection.value,
    connect,
    disconnect,
    enableRead,
    counters
  };
}