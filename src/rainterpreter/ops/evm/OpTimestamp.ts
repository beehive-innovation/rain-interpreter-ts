import { BigNumber } from "ethers";
import { InterpreterData, opClosure } from "../../../interpreter/types";

/**
 * @public
 */
export const OpTimestamp: opClosure = async(
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): Promise<BigNumber[]> => {
    try{
        return [
            BigNumber.from(
                (
                    await _data.provider.getBlock(
                        _data.blockNumber
                    )
                ).timestamp
            )
        ]
    }
    catch(err) {
        throw new Error(`something went wrong, reason: ${err}`)
    }
}