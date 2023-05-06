'use client';
import { use } from 'react';
import { createStore } from 'react-client-store';

const init = (props) => ({
  count: props.count,
});

const reducers = {
  increment: (s) => ({ ...s, count: s.count + 1 }),
  decrement: (s) => ({ ...s, count: s.count - 1 }),
};

const Store = createStore(init, reducers);

export function StoreProvider(props) {
  const initialState = use(props.initialStatePromise);
  return (
    <Store.Provider value={initialState}>{props.children}</Store.Provider>
  );
}
export const useEmitEvent = Store.hooks.useEmitEvent;
export const bindProps = Store.bindProps;
