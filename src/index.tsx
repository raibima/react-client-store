import {
  ReactNode,
  createContext,
  memo,
  useCallback,
  useContext,
  useReducer
} from "react";

type State = Record<string, unknown>;

type ReducerFn<TValue, TParams> = (
  state: TValue,
  params?: TParams
) => TValue;

export type Reducer<TValue, TParams = unknown> = Record<
  string,
  ReducerFn<TValue, TParams>
>;

type EmitEvent<TEvent, TParams = unknown> = (
  event: TEvent,
  params?: TParams
) => void;

type SelectorFunction<TValue> = (value: TValue, ownProps: TValue) => TValue;
type SelectorArray<TValue> = (keyof TValue)[];

type BindPropsSelector<TValue> =
  | SelectorFunction<TValue>
  | SelectorArray<TValue>
  | keyof TValue;

type ProviderProps<TValue> = { children: ReactNode, value?: TValue }

interface Store<TValue, TEvent, TParams> {
  Provider: React.ComponentType<ProviderProps<TValue>>;
  hooks: {
    useEmitEvent: () => EmitEvent<TEvent, TParams>;
  };
  bindProps: (
    Component: React.ComponentType<any>,
    selector: BindPropsSelector<TValue>
  ) => React.ComponentType<any>;
}

const noop = () => {};

export function createStore<
  TValue extends State,
  TEvent extends string,
  TParams = unknown
>(
  init: () => TValue,
  reducers: Reducer<TValue, TParams>
): Store<TValue, TEvent, TParams> {
  const ValueContext = createContext<TValue>({} as TValue);
  const EmitterContext = createContext<EmitEvent<TEvent, TParams>>(
    noop
  );

  function reducer(
    state: TValue,
    event: { type: string; params?: TParams }
  ): TValue {
    const reduce = reducers[event.type];
    return reduce(state, event.params);
  }

  function Provider({ children, value }: ProviderProps<TValue>) {
    const [state, dispatch] = useReducer(reducer, value, init);
    const emitter = useCallback<EmitEvent<TEvent, TParams>>((event, params) => {
      dispatch({
        type: event,
        params
      });
    }, []);

    return (
      <ValueContext.Provider value={state}>
        <EmitterContext.Provider value={emitter}>
          {children}
        </EmitterContext.Provider>
      </ValueContext.Provider>
    );
  }

  function useEmitEvent(): EmitEvent<TEvent, TParams> {
    return useContext(EmitterContext);
  }

  function bindProps(
    Component: React.ComponentType<any>,
    selector: BindPropsSelector<TValue>
  ): React.ComponentType<any> {
    const MemoizedComponent = memo(Component);

    function Container(ownProps: TValue) {
      const value = useContext(ValueContext);
      let props: Record<string, any> = {};

      if (typeof selector === "function") {
        props = selector(value, ownProps);
      } else if (typeof selector === "string") {
        props[selector] = value[selector];
      } else if (Array.isArray(selector)) {
        const initProps: Record<string, any> = {};
        props = selector.reduce((result, key) => {
          result[key as string] = value[key];
          return result;
        }, initProps);
      }

      return <MemoizedComponent {...props} />;
    }

    Container.displayName = `${Component.displayName} Container`;

    return Container;
  }

  return {
    Provider,
    hooks: {
      useEmitEvent
    },
    bindProps
  };
}
