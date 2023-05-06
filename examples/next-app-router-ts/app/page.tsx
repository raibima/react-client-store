import Counter from './Counter';
import { StoreProvider } from './store';

export default async function Home() {

  return (
      <StoreProvider>
        <h1>Counter App</h1>
        <Counter />
      </StoreProvider>
  );
}
