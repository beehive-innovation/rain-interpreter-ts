import { BigNumber } from "ethers";
import { InterpreterData, opClosure } from "../../../interpreter/types";
import { ITierV2__factory } from "../../../typechain";
import { paddedUInt160 } from "../../../utils";

/**
 * @public
 */
export const OpITierV2Report: opClosure = async(
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): Promise<BigNumber[]> => {
    const context_ = _operand ? _inputs.splice(-_operand) : []
    const item2_ = _inputs.pop()
    const item1_ = _inputs.pop()
    const blockTag = _data.blockNumber
    const voidSigner = _data.voidSigner
    if (item1_ && item2_ && context_.length === _operand) {
        const account_ = paddedUInt160(item2_)
        try {
            const iTierV2Contract = ITierV2__factory.connect(
                paddedUInt160(item1_),
                voidSigner
            )
            return  [await iTierV2Contract.report(account_, context_, { blockTag })]
        }
        catch(err) {
            throw new Error(`something went wrong, reason: ${err}`)
        }
    } 
    else throw new Error('Undefined stack variables')
}
