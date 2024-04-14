import { parseNearAmount } from "near-api-js/lib/utils/format";

interface AudioBook {
  id: string;
  title: string;
  description: string;
  image: string;
  audio: string;
  price: string;
}


const GAS = 100000000000000;

export async function createAudioBook(audioBook: AudioBook) {
  console.log(audioBook)
  if (audioBook.price === null) {
    throw Error("Invalid price");
  }
  audioBook.price = parseNearAmount(audioBook.price + "") as string;
  const response = await window.contract.addAudioBook({ audioBook });
  return response;
}

export async function listAudioBook(audioBookId: string, price: string) {
  if (price === null) {
    throw Error("Invalid price");
  }
  price = parseNearAmount(price + "") as string;
  const response = await window.contract.listAudioBook({ audioBookId: audioBookId, price });
  console.log(response);
  return response;
}

export async function editListing(audioBookId: string, price: string) {
  if (price === null) {
    throw Error("Invalid price");
  }
  price = parseNearAmount(price + "") as string;
  const response = await window.contract.editListing({ audioBookId: audioBookId, price });
  console.log(response);
  return response;
}

export async function cancelListing(audioBookId: string) {
  const response = await window.contract.cancelListing({ audioBookId: audioBookId });
  return response;
}

export async function changeProfilePic(picture: string) {
  const response = await window.contract.updateUser({ profilePic: picture });
  return response;
}

export async function deleteAudioBook(id: string) {
  const response = await window.contract.deleteAudioBook({ id: id });
  return response;
}

export async function buyAudioBook(audioBookId: string, price: string, owner: string) {
  console.log(`id: ${audioBookId}, price: ${price}, owner: ${owner}`);  
  const response = await window.contract.buyAudioBook({ audioBookId: audioBookId }, GAS, price); // buy_product for the Rust contract
  console.log(response);
  return response;
}

export async function login() {
  const response = await window.contract.login();
  console.log(response);
  return response;
}

export async function register() {
  const response = await window.contract.register();
  console.log(response);
  return response;
}

export async function getAudioBooks() {
  const response = await window.contract.getAudioBooks();
  return response;
}

export async function getUser(id: string) {
  const response = await window.contract.getUser({ id: id });
  return response;
}

export async function signOff(){
  await window.contract.logout();
  await window.walletConnection.signOut();
  return;
}
