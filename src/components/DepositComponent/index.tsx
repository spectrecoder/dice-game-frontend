import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
// import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import usePersonalInfo from "../../hooks/usePersonalInfo";
import useSocket from "../../hooks/useSocket";
import "./style.css";

const DepositComponent = () => {
  const curSocket = useSocket();
  const { handleDepositSol, updateFund, getStatus, depositingFlag, setDepositingFlag } =
    usePersonalInfo();
  const [solAmount, setSolAmount] = useState<string>("");
  const [recvAmount, setRecvAmount] = useState<number>(0);
  const [depositFlag, setDepositFlag] = useState<boolean>(true);
  const rate = 100;

  useEffect(() => {
    if (depositingFlag) {
      setDepositFlag(true);
      setDepositingFlag(false);
      toast.warn(`Deposit Fail!`, {
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
  }, [depositingFlag]);

  useEffect(() => {
    if (curSocket) {
      curSocket.on("message", async (...data: any) => {
        if (data[0].type === "deposit_fund") {
          setDepositFlag(true);
          if (data[0].ok) {
            updateFund();
            getStatus();
            toast.success(`Deposit Success!`, {
              position: "bottom-left",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          } else {
            updateFund();
            getStatus();
            toast.warn(`Deposit Fail! Please try again`, {
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
        }
      });
    }
  }, [curSocket]);

  const checkNumber = (value: string) => {
    const reg = /^-?\d*(\.\d*)?$/;
    if (
      (!isNaN(Number(value)) && reg.test(value)) ||
      value === "" ||
      value === "-"
    ) {
      return true;
    }
    return false;
  };

  const handleSolChange = (event: any) => {
    if (checkNumber(event.target.value)) {
      setSolAmount(event.target.value);
      setRecvAmount(Number(event.target.value) * rate);
    }
  };

  getStatus();

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
              <h2 className="title">DEPOSIT SOLANA</h2>
            </div>
            <p
              className="content-desc animated"
              data-animation="fadeInUpShorter"
              data-animation-delay="0.4s"
            >
              Input S@L to deposit.
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
                  placeholder="Input sol to deposit."
                  value={solAmount}
                  onChange={handleSolChange}
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
                    src="theme-assets/images/dice-gold-coin.png"
                    alt="team-profile-1"
                    className="rounded-circle"
                    style={{ width: "2.5rem" }}
                  />
                  <p className="ml-2 mb-0">{recvAmount}</p>
                </div>
                {depositFlag ? (
                  <button
                    onClick={() => {
                      if (Number(solAmount) >= 0.01) {
                        setDepositFlag(false);
                        handleDepositSol(solAmount);
                        setSolAmount("");
                        setRecvAmount(0);
                      } else {
                        toast.warn(
                          `Depositing sol amount is small, you should deposit over 0.01 sol!`,
                          {
                            position: "bottom-left",
                            autoClose: 1500,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                          }
                        );
                      }
                    }}
                    className="btn btn-lg btn-gradient-purple btn-glow animated"
                    data-animation="fadeInUpShorter"
                    data-animation-delay="1.1s"
                  >
                    Deposit
                  </button>
                ) : (
                  <button
                    onClick={() => {}}
                    className="btn btn-lg btn-gradient-purple btn-glow animated"
                    data-animation="fadeInUpShorter"
                    data-animation-delay="1.1s"
                    disabled
                  >
                    Depositing...
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

export default DepositComponent;
