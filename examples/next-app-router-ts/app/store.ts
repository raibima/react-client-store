'use client';

import { createStore, Reducer } from 'react-client-store';


const state = () => ({
  count: 0
});

type State = ReturnType<typeof state>;

type Params = {
  multiplier?: number
}

const reducers = {
  increment: (state, params) => ({
    ...state,
    count: params?.multiplier ? state.count * params.multiplier : state.count + 1
  }),
  decrement: (state, params) => ({ ...state, count: state.count - 1 })
} satisfies Reducer<State, Params>

export const Store = createStore<State, keyof typeof reducers, Params>(state, reducers);
export const StoreProvider = Store.Provider;
export const useEmitEvent = Store.hooks.useEmitEvent;
export const bindProps = Store.bindProps;
