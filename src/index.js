import {createContext, useContext, useReducer, useCallback, memo} from 'react';

export function createStore(init, reducers) {
  const ValueContext = createContext();
  const EmitterContext = createContext();
  function reducer(state, event) {
    const reduce = reducers[event.type];
    return reduce(state, event.params);
  }
  function Provider(props) {
    const [state, dispatch] = useReducer(reducer, props, init);
    const emitter = useCallback((event, params) => {
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
  function bindProps(Component, selector) {
    const MemoizedComponent = memo(Component);
    function Container(ownProps) {
      const value = useContext(ValueContext);
      let props = {};
      if (typeof selector === 'function') {
        props = selector(value, ownProps);
      } else if (typeof selector === 'string') {
        props[selector] = value[selector];
      } else if (Array.isArray(selector)) {
        props = selector.reduce((result, key) => {
          result[key] = value[key];
          return result;
        }, {});
      }
      return <MemoizedComponent {...props} />;
    }
    Container.displayName = Component.name + 'Container';
    return Container;
  }
  return {
    Provider: Provider,
    hooks: {
      useEmitEvent: useEmitEvent,
    },
    bindProps,
  };
}
