import {StoreProvider} from './store';
import Counter from './Counter';
import {Suspense} from 'react';

async function getInitialState() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return {
    count: 100,
  };
}

export default async function Home() {
  const initialStatePromise = getInitialState();
  return (
    <Suspense fallback="Loading...">
      <StoreProvider initialStatePromise={initialStatePromise}>
        <h1>Counter App</h1>
        <Counter />
      </StoreProvider>
    </Suspense>
  );
}
