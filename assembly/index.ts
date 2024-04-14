import { AudioBook, listedBooks } from "./model/bookmodel";
import { User, users } from "./model/usermodel";
import { ContractPromiseBatch, context, logging, u128 } from "near-sdk-as";

export function login(): string {
  let registeredUser = getUser(context.sender);
  if (registeredUser == null) {
    return "Wallet Not Signed Up yet";
  }
  registeredUser.loginStatus = true;
  users.set(context.sender, registeredUser);
  return "Logged in successfully";
}

export function logout(): void{
  let registeredUser = getUser(context.sender);
  if (registeredUser == null) {
    return;
  }
  registeredUser.loginStatus = false;
  users.set(context.sender, registeredUser);
}


export function register(): string {
  const registeredUser = getUser(context.sender);
  if (registeredUser != null) {
    return "Already Registered";
  }
  users.set(context.sender, User.fromPayload({ id: context.sender, loginStatus: false, profilePic: "/avatar.jpg" }));
  return "User registered successfully";
}

export function updateUser(profilePic: string): void {
  let registeredUser = getUser(context.sender);
  if (registeredUser == null) {
    return;
  }
  registeredUser.updateUser(profilePic);
  users.set(context.sender, registeredUser);
}


export function deleteAudioBook(id: string): void {
  listedBooks.delete(id);
}

export function addAudioBook(audioBook: AudioBook): void {
  let storedProduct = listedBooks.get(audioBook.id);
  if (storedProduct !== null) {
    throw new Error(`a book with ${audioBook.id} already exists`);
  }
  listedBooks.set(audioBook.id, AudioBook.fromPayload(audioBook));
}

export function getAudioBook(id: string): AudioBook | null {
  if (!login) {
    throw new Error("Login First");
  }
  return listedBooks.get(id);
}

export function getAudioBooks(): AudioBook[] {
  if (!login) {
    throw new Error("Login First");
  }
  return listedBooks.values();
}

export function getUser(id: string): User | null {
  return users.get(id);
}

export function getUsers(): User[] {
  return users.values();
}

export function buyAudioBook(audioBookId: string): void {
  if (!login) {
    throw new Error("Login First");
  }

  const audioBook = getAudioBook(audioBookId);
  logging.log(audioBook);
  if (audioBook == null) {
    throw new Error("book not found");
  }

  if (audioBook.price.toString() != context.attachedDeposit.toString()) {
    throw new Error("Invalid price");
  }

  if (audioBook.sellStatus) {
    assert(false, "Book already sold");
  }

  if(audioBook.owner == context.sender) {
    assert(false, "Cannot buy your own book");
  }

  ContractPromiseBatch.create(audioBook.owner).transfer(
    context.attachedDeposit
  );

  audioBook.updateOwnerShip();
  audioBook.sellingStatus();
  listedBooks.set(audioBookId, audioBook);
}

export function listAudioBook(audioBookId: string, price: u128): void {
  if (!login) {
    throw new Error("Login First");
  }
  const audioBook = getAudioBook(audioBookId);
  if (audioBook == null) {
    throw new Error("book not found");
  }

  audioBook.updatePrice(price);
  audioBook.sellingStatus();
  listedBooks.set(audioBookId, audioBook);
}

export function editListing(audioBookId: string, price: u128): void {
  if (!login) {
    throw new Error("Login First");
  }
  const audioBook = getAudioBook(audioBookId);
  if (audioBook == null) {
    throw new Error("book not found");
  }
  if (audioBook.sellStatus) {
    assert(false, "List the book first");
  }

  audioBook.updatePrice(price);
  listedBooks.set(audioBookId, audioBook);
}

export function cancelListing(audioBookId: string): void {
  if (!login) {
    throw new Error("Login First");
  }
  const audioBook = getAudioBook(audioBookId);
  if (audioBook == null) {
    throw new Error("book not found");
  }
  if (audioBook.sellStatus) {
    assert(false, "Book not listed");
  }
  audioBook.sellingStatus();
  audioBook.updatePrice(u128.Zero);
  listedBooks.set(audioBookId, audioBook);
}