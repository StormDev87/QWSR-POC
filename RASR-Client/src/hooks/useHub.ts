import {HubConnection, HubConnectionBuilder, HubConnectionState} from "@microsoft/signalr";
import { useEffect, useState } from "react";
import {ConnectionSrCommand} from "../types.ts";

/**
 * Start/Stop the provided hub connection (on connection change or when the component is unmounted)
 * @param {HubConnection} hubConnection The signalR hub connection
 * @param command
 * @return {HubConnection} the current signalr connection
 * @return {any} the signalR error in case the start does not work
 */
export function useHub(urlSignalR: string, command: ConnectionSrCommand) {
  const [_, setHubConnectionState] = useState<HubConnectionState>(HubConnectionState.Disconnected);
  const [error, setError] = useState();

  const [signalRConnection, setSignalRConnection] = useState<HubConnection>();

  useEffect(()=>{
    setSignalRConnection(
      new HubConnectionBuilder()
      .withUrl(urlSignalR)
      .withAutomaticReconnect()
      .build()
    )
  },[])

  useEffect(()=>{
    switch (command) {
      case ConnectionSrCommand.Connect:

        signalRConnection?.start()
          .then(()=> setHubConnectionState(signalRConnection?.state))
              .catch(reason => {
                console.log(reason)
                setError(reason);
              });
        break;
      case ConnectionSrCommand.Disconnect:
        console.log("Call Disconnect")
        signalRConnection?.stop()
          .then(()=> setHubConnectionState(signalRConnection?.state))
          .catch(reason => {
            console.log(reason)
            setError(reason);
          });
        break
    }
  },[command])

  return { signalRConnection, error };
}