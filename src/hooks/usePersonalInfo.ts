import { useContext } from "react";
import { PersonalInfoContext } from "../contexts/PersonalInfoContext";

const usePersonalInfo = () => {
  const {
    tapFlag,
    fund,
    bettingFlag,
    depositingFlag,
    withdrawingFlag,
    withdrawSuccessFlag,
    betColor,
    winColor,
    poolState,
    setTapFlag,
    setDepositingFlag,
    setWithdrawingFlag,
    setWithdrawSuccessFlag,
    whithdraw,
    depositSol,
    withdrawSol,
    updateFund,
    getStatus
  } = useContext(PersonalInfoContext);
  return {
    tapFlag: tapFlag,
    fund: fund,
    bettingFlag: bettingFlag,
    depositingFlag: depositingFlag,
    withdrawingFlag: withdrawingFlag,
    withdrawSuccessFlag: withdrawSuccessFlag,
    betColor: betColor,
    winColor: winColor,
    poolState: poolState,
    setTapFlag: setTapFlag,
    setDepositingFlag: setDepositingFlag,
    setWithdrawingFlag: setWithdrawingFlag,
    setWithdrawSuccessFlag: setWithdrawSuccessFlag,
    whithdraw: whithdraw,
    handleDepositSol: depositSol,
    handleWithdrawSol: withdrawSol,
    updateFund: updateFund,
    getStatus: getStatus
  };
};

export default usePersonalInfo;
