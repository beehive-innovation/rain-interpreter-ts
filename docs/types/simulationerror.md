[Home](../index.md) &gt; [SimulationError](./simulationerror.md)

# Type SimulationError

Result of a failed expression eval in a simulation that is available in run() callback signature

<b>Signature:</b>

```typescript
type SimulationError = {
    interpreter: string;
    error: string;
    blockNumber?: number;
    blockTimestamp?: number;
    expression?: StateConfig;
    index?: number;
};
```
