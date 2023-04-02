[Home](../index.md) &gt; [kvStorage](./kvstorage.md)

# Type kvStorage

Type os interpreter-ts storage obj which holds key/value pairs mapped by sender and namespace addresses

<b>Signature:</b>

```typescript
type kvStorage = {
    [sender: string]: {
        [namespace: string]: {
            key: BigNumber;
            value: BigNumber;
        }[];
    };
};
```
