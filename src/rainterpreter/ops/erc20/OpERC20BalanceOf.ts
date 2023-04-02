import { paddedUInt160 } from "../../../utils";
import { BigNumber } from "ethers";
import { ERC20BurnableUpgradeable__factory } from "../../../typechain";
import { InterpreterData, opClosure } from "../../../interpreter/types";

/** 
 * @public
 */
export const OpERC20BalanceOf: opClosure = async(
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
        const erc20Address_ = paddedUInt160(item1_)
        try {
            const erc20Contract_ = ERC20BurnableUpgradeable__factory.connect(
                erc20Address_,
                voidSigner
            )
            return [await erc20Contract_.balanceOf(account_, { blockTag })]
        }
        catch(err) {
            throw new Error(`something went wrong, reason: ${err}`)
        }
    } 
    else throw new Error('Undefined stack variables')
}
