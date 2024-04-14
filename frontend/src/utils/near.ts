import { connect, Contract, keyStores, WalletConnection } from "near-api-js";
import { formatNearAmount } from "near-api-js/lib/utils/format";
import environment from "../config";
import { signOff } from "./audiobook";

declare global {
  interface Window {
    walletConnection: any;
    accountId: any;
    contract: any;
  }
}

export async function initializeContract() {
  const nearEnv = environment("testnet");
  const near = await connect(
    Object.assign(
      { keyStore: new keyStores.BrowserLocalStorageKeyStore() },
      nearEnv,
      (nearEnv.walletUrl = "https://testnet.mynearwallet.com/")
    )
  );

  window.walletConnection = new WalletConnection(near, "Audio Book Market");
  window.accountId = window.walletConnection.getAccountId();
  window.contract = new Contract(
    window.walletConnection.account(),
    nearEnv.contractName,
    {
      viewMethods: ["getAudioBook", "getAudioBooks", "getUser"],
      changeMethods: [
        "login",
        "register",
        "logout",
        "addAudioBook",
        "buyAudioBook",
        "listAudioBook",
        "editListing",
        "cancelListing",
        "updateUser",
        "deleteAudioBook",
      ],
      useLocalViewExecution: true,
    }
  );
}

export async function accountBalance() {
  return formatNearAmount(
    (await window.walletConnection.account().getAccountBalance()).total,
    2
  );
}

export async function getAccountId() {
  return window.walletConnection.getAccountId();
}

export async function login() {
  await window.walletConnection.requestSignIn({
    contractId: "samplecontract.arim.testnet",
  });
}

export async function logout(){
  await signOff();
}
