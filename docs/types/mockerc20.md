[Home](../index.md) &gt; [MockERC20](./mockerc20.md)

# Type MockERC20

ERC20 token mock type

<b>Signature:</b>

```typescript
type MockERC20 = {
    type: AssetType.erc20;
    address: BigNumber;
    balance: BigNumber;
    totalSupply: BigNumber;
    decimals: number;
    snapshotId?: BigNumber;
};
```
