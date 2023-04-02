import { BigNumber } from "ethers";
import { InterpreterData, opClosure } from "../../../../interpreter/types";
import { ERC20SnapshotUpgradeable__factory } from "../../../../typechain";
import { paddedUInt160 } from "../../../../utils";

/**
 * @public
 */
export const OpERC20SnapshotTotalSupplyAt: opClosure = async(
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): Promise<BigNumber[]> => {
    const item2_ = _inputs.pop()
    const item1_ = _inputs.pop()
    const blockTag = _data.blockNumber
    const voidSigner = _data.voidSigner
    if (item1_ && item2_) {
        const snapshotId_ = item2_
        const erc20Address_ = paddedUInt160(item1_)
        try {
            const erc20Snapshot_ = ERC20SnapshotUpgradeable__factory.connect(
                erc20Address_,
                voidSigner
            )
            return [await erc20Snapshot_.totalSupplyAt(snapshotId_, { blockTag })]
        }
        catch(err) {
            throw new Error(`something went wrong, reason: ${err}`)
        }
    }
    else throw new Error('Undefined stack variables')
}