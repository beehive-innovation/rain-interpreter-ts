[Home](../index.md) &gt; [MockAccount](./mockaccount.md)

# Type MockAccount

Ethers account mock type

<b>Signature:</b>

```typescript
type MockAccount = {
    [key: string]: any;
    address: BigNumber;
    assets: (MockERC20 | MockERC721 | MockERC1155)[];
    chainlink: {
        updatedAt: number;
        answer: BigNumber;
    } | undefined;
    iTier: {
        iTierContract: BigNumber;
        report: BigNumber;
    }[];
    iOrderbook: {
        iOrderbookContract: BigNumber;
        vaults: {
            tokenAddress: BigNumber;
            vaultId: BigNumber;
            balance: BigNumber;
        }[];
    }[];
    iSale: {
        status: iSaleStatus;
        reserve: MockERC20;
        token: MockERC20;
    } | undefined;
    iVerify: {
        iVerifyContract: BigNumber;
        status: iVerifyStatus;
        timestamp: number;
    }[];
};
```
