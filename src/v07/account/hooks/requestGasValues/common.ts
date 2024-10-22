import { PublicClient, Hex } from "viem";
import { JsonRpcProvider } from "ethers";
import { RequestGasValuesFunc } from "../types";
import { packGas, toRawUserOperation } from "../../../entryPoint";

interface GasEstimate {
  preVerificationGas: Hex | number;
  verificationGasLimit: Hex | number;
  callGasLimit: Hex | number;
}

export const withEthClient = (
  ethClient: PublicClient | JsonRpcProvider,
): RequestGasValuesFunc => {
  if (ethClient instanceof JsonRpcProvider) {
    return async (userop, entryPoint, stateOverrideSet) => {
      const est = (await ethClient.send(
        "eth_estimateUserOperationGas",
        stateOverrideSet !== undefined
          ? [toRawUserOperation(userop), entryPoint, stateOverrideSet]
          : [toRawUserOperation(userop), entryPoint],
      )) as GasEstimate;

      const accountGasLimits = packGas(
        BigInt(est.callGasLimit),
        BigInt(est.verificationGasLimit),
      );

      return {
        preVerificationGas: BigInt(est.preVerificationGas),
        accountGasLimits: accountGasLimits,
      };
    };
  }

  return async (userop, entryPoint, stateOverrideSet) => {
    const est = (await ethClient.transport.request({
      method: "eth_estimateUserOperationGas",
      params:
        stateOverrideSet !== undefined
          ? [userop, entryPoint, stateOverrideSet]
          : [userop, entryPoint],
    })) as GasEstimate;

    const accountGasLimits = packGas(
      BigInt(est.callGasLimit),
      BigInt(est.verificationGasLimit),
    );

    return {
      preVerificationGas: BigInt(est.preVerificationGas),
      accountGasLimits: accountGasLimits,
    };
  };
};
