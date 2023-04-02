import { BigNumber } from "ethers";
import { InterpreterData, opClosure } from "../../../interpreter/types";
import { ERC1155BurnableUpgradeable__factory } from "../../../typechain";
import { paddedUInt160 } from "../../../utils";

/**
 * @public
 */
export const OpERC1155BalanceOf: opClosure = async(
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): Promise<BigNumber[]> => {
    const item3_ = _inputs.pop()
    const item2_ = _inputs.pop()
    const item1_ = _inputs.pop()
    const blockTag = _data.blockNumber
    const voidSigner = _data.voidSigner
    if (item1_ && item2_ && item3_) {
        const id_ = BigNumber.from(item3_)
        const account_ = paddedUInt160(item2_)
        const erc1155Address_ = paddedUInt160(item1_)
        try {
            const erc1155Contract_ = ERC1155BurnableUpgradeable__factory.connect(
                erc1155Address_,
                voidSigner
            )
            return [await erc1155Contract_.balanceOf(account_, id_, { blockTag })]
        }
        catch(err) {
            throw new Error(`something went wrong, reason: ${err}`)
        }
    } 
    else throw new Error('Undefined stack variables')
}