import { BigNumber } from "ethers";
import { InterpreterData, opClosure } from "../../../interpreter/types";
import { scale18 } from "../../../lib/FixedPointMath";
import { AggregatorV3Interface__factory } from "../../../typechain";
import { paddedUInt160, paddedUInt256 } from "../../../utils";

/**
 * @public
 */
export const OpChainlinkOraclePrice: opClosure = async(
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): Promise<BigNumber[]> => {
    const feed = paddedUInt160(_inputs[0])
    const staleAfter = paddedUInt256(_inputs[1])
    const blockTag = _data.blockNumber
    const voidSigner = _data.voidSigner
    try {
        const chainlink = AggregatorV3Interface__factory.connect(
            feed,
            voidSigner
        )
        const result = await chainlink.latestRoundData({ blockTag })
        if (
            BigNumber.from(
                (await _data.provider.getBlock(_data.blockNumber)).timestamp
            )
                .sub(result[3])
                .lt(staleAfter)
        ) {
            return [
                scale18(
                    result[1],
                    await chainlink.decimals({ blockTag })
                )
            ]
        }
        else throw new Error('STALE_PRICE')
    }
    catch(err) {
        throw new Error(`something went wrong, reason: ${err}`)
    }
}