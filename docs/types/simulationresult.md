[Home](../index.md) &gt; [SimulationResult](./simulationresult.md)

# Type SimulationResult

Result of a successfull evaluated expression in a simulation that is available in run() callback signature

<b>Signature:</b>

```typescript
type SimulationResult = {
    interpreter: string;
    finalStack: BigNumber[];
    blockNumber: number;
    blockTimestamp: number;
    expression: StateConfig;
    index: number;
};
```
