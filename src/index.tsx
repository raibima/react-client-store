import {
  PropsWithChildren,
  createContext,
  memo,
  useCallback,
  useContext,
  useReducer,
} from 'react';

type StoreInit<TProviderProps, TValue> = (props: TProviderProps) => TValue;

export type Reducer<T extends StoreInit<any, any>> = Record<
  string,
  (state: ReturnType<T>, params: any) => ReturnType<T>
>;

const noop = () => {};

export function createStore<
  TProviderProps extends Record<string, any>,
  TValue extends Record<string, any>,
  TReducer extends Record<string, (state: TValue, params: any) => any>,
>(init: StoreInit<TProviderProps, TValue>, reducers: TReducer) {
  type Event = keyof TReducer;
  type Params<T extends Event> = Parameters<TReducer[T]>[1];
  type EmitEvent = <T extends Event>(event: T, params: Params<T>) => void;

  const ValueContext = createContext<TValue | null>(null);
  const EmitterContext = createContext<EmitEvent>(noop);

  function reducer<T extends Event>(
    state: TValue,
    event: {type: T; params?: Params<T>},
  ): TValue {
    const reduce = reducers[event.type];
    return reduce(state, event.params);
  }

  function Provider(props: PropsWithChildren<TProviderProps>) {
    const [state, dispatch] = useReducer(reducer, props, init);
    const emitter = useCallback<EmitEvent>((event, params) => {
      dispatch({
        type: event,
        params,
      });
    }, []);

    return (
      <ValueContext.Provider value={state}>
        <EmitterContext.Provider value={emitter}>
          {props.children}
        </EmitterContext.Provider>
      </ValueContext.Provider>
    );
  }

  function useEmitEvent() {
    return useContext(EmitterContext);
  }

  function bindProps<TProps extends Record<string, any>>(
    Component: React.ComponentType<TProps>,
    selector:
      | keyof TValue
      | (keyof TValue)[]
      | ((value: TValue, ownProps: Partial<TProps>) => Partial<TProps>),
  ) {
    const MemoizedComponent = memo(Component) as any as typeof Component;

    function Container(ownProps: Partial<TProps>) {
      const value = useContext(ValueContext);
      if (value == null) {
        throw new Error();
      }

      let props: Record<string, any> = {};
      if (typeof selector === 'function') {
        props = selector(value, ownProps);
      } else if (typeof selector === 'string') {
        props[selector] = value[selector];
      } else if (Array.isArray(selector)) {
        const initProps: Record<string, any> = {};
        props = selector.reduce((result, key) => {
          result[key as string] = value[key];
          return result;
        }, initProps);
      }

      return <MemoizedComponent {...ownProps} {...(props as TProps)} />;
    }

    Container.displayName = `${Component.displayName} Container`;

    return Container;
  }

  return {
    Provider,
    hooks: {
      useEmitEvent,
    },
    bindProps,
  };
}
