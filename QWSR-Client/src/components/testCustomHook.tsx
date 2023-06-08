import { component$ } from '@builder.io/qwik';
import {useMyCustomHook} from "~/hooks/useMyCustomHook";

export const TestCustomHook = component$(() => {
  const { value, increment } = useMyCustomHook();

  return (
    <>
      <button onClick$={increment}>Increment</button>
      <div>Count: {value.value}</div>
    </>
  );
});