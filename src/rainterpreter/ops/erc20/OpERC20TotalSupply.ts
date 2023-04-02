import { BigNumber } from "ethers";
import { InterpreterData, opClosure } from "../../../interpreter/types";
import { ERC20BurnableUpgradeable__factory } from "../../../typechain";
import { paddedUInt160 } from "../../../utils";

/**
 * @public 
 */
export const OpERC20TotalSupply: opClosure = async(
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): Promise<BigNumber[]> => {
    const item_ = _inputs.pop()
    const blockTag = _data.blockNumber
    const voidSigner = _data.voidSigner
    if (item_) {
        const erc20Address_ = paddedUInt160(item_)
        try {
            const erc20Contract_ = ERC20BurnableUpgradeable__factory.connect(
                erc20Address_,
                voidSigner
            )
            return [await erc20Contract_.totalSupply({ blockTag })]
        }
        catch(err) {
            throw new Error(`something went wrong, reason: ${err}`)
        }
    } 
    else throw new Error('Undefined stack variable')
}