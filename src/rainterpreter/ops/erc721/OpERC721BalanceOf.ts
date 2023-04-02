import { BigNumber } from "ethers";
import { InterpreterData, opClosure } from "../../../interpreter/types";
import { ERC721BurnableUpgradeable__factory } from "../../../typechain";
import { paddedUInt160 } from "../../../utils";

/**
 * @public
 */
export const OpERC721BalanceOf: opClosure = async(
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): Promise<BigNumber[]> => {
    const item2_ = _inputs.pop()
    const item1_ = _inputs.pop()
    const blockTag = _data.blockNumber
    const voidSigner = _data.voidSigner
    if (item1_ && item2_) {
        const account_ = paddedUInt160(item2_)
        const erc721Address_ = paddedUInt160(item1_)
        try {
            const erc721Contract_ = ERC721BurnableUpgradeable__factory.connect(
                erc721Address_,
                voidSigner
            )
            return [await erc721Contract_.balanceOf(account_, { blockTag })]
        }
        catch(err) {
            throw new Error(`something went wrong, reason: ${err}`)
        }
    } 
    else throw new Error('Undefined stack variables')
}
