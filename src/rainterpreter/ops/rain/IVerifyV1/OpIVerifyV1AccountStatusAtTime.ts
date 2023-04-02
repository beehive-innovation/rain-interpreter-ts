import { BigNumber } from "ethers";
import { InterpreterData, opClosure } from "../../../../interpreter/types";
import { IVerifyV1__factory } from "../../../../typechain";
import { paddedUInt160 } from "../../../../utils";

/**
 * @public
 */
export const OpIVerifyV1AccountStatusAtTime: opClosure = async(
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): Promise<BigNumber[]> => {
    const timestamp = _inputs[2]
    const account = paddedUInt160(_inputs[1])
    const contract = paddedUInt160(_inputs[0])
    const blockTag = _data.blockNumber
    const voidSigner = _data.voidSigner
    try {
        const iVerifyV1 = IVerifyV1__factory.connect(
            contract,
            voidSigner
        )
        return [
            await iVerifyV1.accountStatusAtTime(account, timestamp, { blockTag })
        ]
    }
    catch(err) {
        throw new Error(`something went wrong, reason: ${err}`)
    }
}