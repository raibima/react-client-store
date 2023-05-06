import {StoreProvider} from './store';
import Counter from './Counter';

export default function Home() {
  return (
    <StoreProvider>
      <h1>Counter App</h1>
      <Counter />
    </StoreProvider>
  )
}
