# react-client-store

`react-client-store` is a lightweight and flexible state management library for React applications. It provides a simple way to create a global store with easy-to-use hooks and higher-order components for handling state and dispatching actions.

## Features

- Simple and minimalistic API
- Context-based state management
- Concurrent safe — Utilizes React state primitives. No external stores.
- Optimized rendering with memoization
- Easy-to-extend functionality with custom reducers
- Compatible with React hooks and functional components

## Installation

To install `react-client-store`, run the following command:

```bash
npm install react-client-store
```

## Usage

### 1. Create a store

First, create a store with the initial state and the reducers:

```javascript
import { createStore } from 'react-client-store';

const initialState = {
  count: 0,
};

const reducers = {
  increment: (state, params) => ({ ...state, count: state.count + params }),
  decrement: (state, params) => ({ ...state, count: state.count - params }),
};

const store = createStore(initialState, reducers);
```

### 2. Use the Provider

Wrap your application with the store's `Provider` component:

```javascript
import React from 'react';
import { createRoot } from 'react-dom/client';
import { store } from './store';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <store.Provider>
    <App />
  </store.Provider>
);
```

### 3. Use hooks to access and update the state

In your components, use the `useEmitEvent` hook to dispatch actions:

```javascript
import React from 'react';
import { store } from './store';

function Counter() {
  const emitEvent = store.hooks.useEmitEvent();

  const increment = () => emitEvent('increment', 1);
  const decrement = () => emitEvent('decrement', 1);

  return (
    <div>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </div>
  );
}

export default Counter;
```

### 4. Bind state properties to your components

Use the `bindProps` function to connect your components to the store:

```javascript
import React from 'react';
import { store } from './store';

function Display({ count }) {
  return <div>{count}</div>;
}

export default store.bindProps(Display, 'count');
```

## API

### createStore(init, reducers)

- `init`: An object representing the initial state of your store.
- `reducers`: An object containing reducer functions for handling actions.

Returns an object containing the `Provider`, hooks, and `bindProps` function.

### Provider

A React component that wraps your application and provides the global store context.

### hooks

An object containing hooks for working with the store.

#### useEmitEvent()

Returns a function that can be used to dispatch actions in your components.

### bindProps(Component, selector)

- `Component`: The React component to connect to the store.
- `selector`: A function, string, or array that defines which state properties should be passed as props to the connected component.

Returns a new component connected to the store.

## License

MIT License. See [LICENSE](LICENSE) for more information.