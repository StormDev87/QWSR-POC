import {useSignal, $, QRL, Signal} from "@builder.io/qwik";

export type UseMyCustomHook = {
  value: Signal<number>;
  increment: QRL<() => void>;
};


export function useMyCustomHook() : UseMyCustomHook {
  const count = useSignal(0);

  const increment = $(() => {
    console.log("My Increment function!")
    count.value = count.value + 1;
  });

  return { value: count, increment: increment };
}