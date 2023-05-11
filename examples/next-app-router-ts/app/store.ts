'use client';
import {createStore, Reducer} from 'react-client-store';

const state = () => ({
  count: 0,
});

type IncrementParams = {
  multiplier?: number;
};

const reducers = {
  increment: (state, params: IncrementParams) => ({
    ...state,
    count: params?.multiplier
      ? state.count * params.multiplier
      : state.count + 1,
  }),
  decrement: (state) => ({...state, count: state.count - 1}),
} satisfies Reducer<typeof state>;

export const Store = createStore(state, reducers);

export const StoreProvider = Store.Provider;
export const useEmitEvent = Store.hooks.useEmitEvent;
export const bindProps = Store.bindProps;
