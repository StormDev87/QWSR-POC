import {$, component$, useSignal, useTask$, useVisibleTask$} from "@builder.io/qwik";
import {useHub} from "~/hooks/useHub";
import {ConnectionSrCommand} from "~/types/signalr";
import {isServer} from "@builder.io/qwik/build";
import {HubConnectionState} from "@microsoft/signalr";

export default component$(() => {
  const cmdHub = useSignal<ConnectionSrCommand>(ConnectionSrCommand.Disconnect);
  const mName = useSignal<string>("");

  const signalR = useHub("http://localhost:5000/RT", cmdHub.value);

  useVisibleTask$((ctx)=>{
    ctx.track(()=> signalR?.signalRConnection)
    mName.value = "DataToHmi";
  })

  // useTask$( (ctx) => {
  //   ctx.track(() => signalR.statusConnection);
  //   if (isServer) {
  //     return;
  //   }
  //   mName.value = "DataToHmi";
  // });

  const connectHub = $(()=>{
    console.log("try to connect!")
    signalR?.connect?.();
    cmdHub.value = ConnectionSrCommand.Connect;
  })

  const disconnectHub = $(()=>{
    signalR?.disconnect?.()
    cmdHub.value = ConnectionSrCommand.Disconnect;
  })

  const gestConnection = $(()=>{
    if (signalR?.signalRConnection?.state === HubConnectionState.Disconnected ){
      console.log("try to connect!")
      signalR?.connect?.();
      cmdHub.value = ConnectionSrCommand.Connect;
    }else{
      signalR?.disconnect?.()
      cmdHub.value = ConnectionSrCommand.Disconnect;
    }
  })

  return (
    <>
      <div>
        STATUS: <>{signalR?.signalRConnection?.state}</>
      </div>

      {signalR?.counters.value.dataCounterAuto}
      {signalR?.counters.value.dataCounterManual}


      {signalR?.signalRConnection?.state === HubConnectionState.Disconnected ?
          <button onClick$={() => {
            connectHub()
          }}>
            Connect
          </button>
        :
          <button onClick$={() => {
            disconnectHub()
          }}>
            Disconnect
          </button>
      }

      {/*<button onClick$={() => {*/}
      {/*  signalR?.signalRConnection?.state === HubConnectionState.Disconnected ? connectHub() : disconnectHub()*/}
      {/*  // connectHub()*/}
      {/*}}>*/}
      {/*  {signalR?.signalRConnection?.state === HubConnectionState.Disconnected ? "Connect" : "Disconnect"}*/}
      {/*</button>*/}

      <button onClick$={() => {
        signalR?.enableRead?.();
      }}>
        Enable Read
      </button>
    </>
  );
});