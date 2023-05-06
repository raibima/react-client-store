import { Suspense } from 'react';
import Counter from './Counter';
import { StoreProvider } from './store';

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
