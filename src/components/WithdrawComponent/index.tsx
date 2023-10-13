import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
// import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import usePersonalInfo from "../../hooks/usePersonalInfo";
import useSocket from "../../hooks/useSocket";
import "./style.css";

const WithdrawComponent = () => {
  const curSocket = useSocket();
  const {
    handleWithdrawSol,
    updateFund,
    getStatus,
    whithdraw,
    withdrawingFlag,
    withdrawSuccessFlag,
    setWithdrawingFlag,
    setWithdrawSuccessFlag,
  } = usePersonalInfo();
  const [diceAmount, setDiceAmount] = useState<string>("");
  const [recvAmount, setRecvAmount] = useState<number>(0);
  const [withdrawFlag, setWithdrawFlag] = useState<boolean>(true);
  const rate = 100;

  useEffect(() => {
    if (withdrawingFlag) {
      setWithdrawFlag(true);
      setWithdrawingFlag(false);
      getStatus();
      toast.warn(`Withdrawing Fail!`, {
        position: "bottom-left",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    if (withdrawSuccessFlag) {
      setWithdrawFlag(true);
      setWithdrawSuccessFlag(false);
      getStatus();
      toast.success(`Withdraw Success!`, {
        position: "bottom-left",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }, [withdrawingFlag, withdrawSuccessFlag]);

  const handleDiceChange = (event: any) => {
    setDiceAmount(event.target.value);
    setRecvAmount(Number(event.target.value) / rate);
  };

  useEffect(() => {
    getStatus();
  }, []);

  return (
    <main>
      <section id="contact" className="contact section-padding">
        <div className="container">
          <div className="heading text-center mb-0">
            <div
              className="animated"
              data-animation="fadeInUpShorter"
              data-animation-delay="0.3s"
            >
              <h6 className="sub-title">REJECT RUMBLE</h6>
              <h2 className="title">WITHDRAW SOL</h2>
            </div>
            <p
              className="content-desc animated"
              data-animation="fadeInUpShorter"
              data-animation-delay="0.4s"
            >
              Input DICE to withdraw.
            </p>
          </div>
          <div className="row">
            <div className="col-xl-8 col-md-12 mx-auto">
              <div className="text-center d-flex flex-column align-items-center">
                <input
                  type="text"
                  className="form-control animated col-6"
                  data-animation="fadeInUpShorter"
                  data-animation-delay="0.8s"
                  name="name"
                  placeholder="Input DICE to withdraw."
                  value={diceAmount}
                  onChange={handleDiceChange}
                />
                <p
                  className="content-desc animated"
                  data-animation="fadeInUpShorter"
                  data-animation-delay="0.4s"
                >
                  You will receive:
                </p>
                <div className="d-flex flex-row align-items-center justify-content-center mb-2">
                  <img
                    src="theme-assets/images/solana-sol-icon.png"
                    alt="team-profile-1"
                    className="rounded-circle"
                    style={{ width: "2.5rem" }}
                  />
                  <p className="ml-2 mb-0">{recvAmount}</p>
                </div>
                {withdrawFlag ? (
                  <button
                    onClick={() => {
                      setWithdrawFlag(false);
                      handleWithdrawSol(diceAmount);
                      setDiceAmount("");
                      setRecvAmount(0);
                    }}
                    className="btn btn-lg btn-gradient-purple btn-glow animated"
                    data-animation="fadeInUpShorter"
                    data-animation-delay="1.1s"
                  >
                    Withdraw
                  </button>
                ) : (
                  <button
                    onClick={() => {}}
                    className="btn btn-lg btn-gradient-purple btn-glow animated"
                    data-animation="fadeInUpShorter"
                    data-animation-delay="1.1s"
                    disabled
                  >
                    Withdrawing...
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default WithdrawComponent;
