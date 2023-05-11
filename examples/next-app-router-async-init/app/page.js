import {StoreProvider} from './store';
import Counter from './Counter';

async function getInitialState() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    count: 100,
  };
}

export default async function Home() {
  const initialState = await getInitialState();
  return (
    <StoreProvider count={initialState.count}>
      <h1>Counter App</h1>
      <Counter />
    </StoreProvider>
  );
}
