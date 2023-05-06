import Counter from './Counter';
import { StoreProvider } from './store';

async function getInitialState() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    count: 100,
  };
}

export default async function Home() {
  const initialState = await getInitialState();
  return (
    <StoreProvider value={initialState}>
      <h1>Counter App</h1>
      <Counter />
    </StoreProvider>
  );
}
