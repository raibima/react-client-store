'use client';
import {useEmitEvent, bindProps} from './store';

function Counter({count}) {
  const emitEvent = useEmitEvent();
  return (
    <div>
      <h2>{count}</h2>
      <button onClick={() => emitEvent('increment')}>Increment</button>
      <button onClick={() => emitEvent('decrement')}>Decrement</button>
    </div>
  );
}

export default bindProps(Counter, 'count');
