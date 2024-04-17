import { AudioBook, listedBooks } from "./model/bookmodel";
import { User, users } from "./model/usermodel";
import { ContractPromiseBatch, context, u128 } from "near-sdk-as";

// Function to check if the user is logged in
function isLoggedIn(): boolean {
  const user = getUser(context.sender);
  return user && user.loginStatus;
}

// Function to get a user by ID
function getUserById(id: string): User | null {
  return users.get(id);
}

// Function to get an audio book by ID
function getAudioBookById(id: string): AudioBook | null {
  return listedBooks.get(id);
}

// Function to handle user login
export function login(): string {
  const registeredUser = getUser(context.sender);
  if (!registeredUser) {
    return "Wallet Not Signed Up yet";
  }
  registeredUser.loginStatus = true;
  users.set(context.sender, registeredUser);
  return "Logged in successfully";
}

// Function to handle user logout
export function logout(): void {
  const registeredUser = getUser(context.sender);
  if (registeredUser) {
    registeredUser.loginStatus = false;
    users.set(context.sender, registeredUser);
  }
}

// Function to register a new user
export function register(): string {
  const registeredUser = getUser(context.sender);
  if (registeredUser) {
    return "Already Registered";
  }
  users.set(context.sender, User.fromPayload({ id: context.sender, loginStatus: false, profilePic: "/avatar.jpg" }));
  return "User registered successfully";
}

// Function to update user profile picture
export function updateUser(profilePic: string): void {
  const registeredUser = getUser(context.sender);
  if (registeredUser) {
    registeredUser.profilePic = profilePic;
    users.set(context.sender, registeredUser);
  }
}

// Function to delete an audio book
export function deleteAudioBook(id: string): void {
  listedBooks.delete(id);
}

// Function to add a new audio book
export function addAudioBook(audioBook: AudioBook): void {
  if (getAudioBookById(audioBook.id)) {
    throw new Error(`A book with ID ${audioBook.id} already exists`);
  }
  listedBooks.set(audioBook.id, AudioBook.fromPayload(audioBook));
}

// Function to buy an audio book
export function buyAudioBook(audioBookId: string): void {
  if (!isLoggedIn()) {
    throw new Error("Login First");
  }

  const audioBook = getAudioBookById(audioBookId);
  if (!audioBook) {
    throw new Error("Book not found");
  }

  const user = getUser(context.sender);
  if (user && audioBook.owner === context.sender) {
    throw new Error("Cannot buy your own book");
  }

  const attachedDeposit = context.attachedDeposit;
  if (audioBook.price.toString() !== attachedDeposit.toString()) {
    throw new Error("Invalid price");
  }

  ContractPromiseBatch.create(audioBook.owner).transfer(attachedDeposit);

  audioBook.updateOwnerShip();
  audioBook.sellingStatus();
  listedBooks.set(audioBookId, audioBook);
}

// Function to list an audio book for sale
export function listAudioBook(audioBookId: string, price: u128): void {
  if (!isLoggedIn()) {
    throw new Error("Login First");
  }

  const audioBook = getAudioBookById(audioBookId);
  if (!audioBook) {
    throw new Error("Book not found");
  }

  audioBook.updatePrice(price);
  audioBook.sellingStatus();
  listedBooks.set(audioBookId, audioBook);
}

// Function to edit the listing of an audio book
export function editListing(audioBookId: string, price: u128): void {
  if (!isLoggedIn()) {
    throw new Error("Login First");
  }

  const audioBook = getAudioBookById(audioBookId);
  if (!audioBook) {
    throw new Error("Book not found");
  }

  if (audioBook.sellStatus) {
    throw new Error("List the book first");
  }

  audioBook.updatePrice(price);
  listedBooks.set(audioBookId, audioBook);
}

// Function to cancel the listing of an audio book
export function cancelListing(audioBookId: string): void {
  if (!isLoggedIn()) {
    throw new Error("Login First");
  }

  const audioBook = getAudioBookById(audioBookId);
  if (!audioBook) {
    throw new Error("Book not found");
  }

  if (!audioBook.sellStatus) {
    throw new Error("Book not listed");
  }

  audioBook.sellingStatus();
  audioBook.updatePrice(u128.Zero);
  listedBooks.set(audioBookId, audioBook);
}

// Function to get all registered users
export function getUsers(): User[] {
  return users.values();
}

// Function to get all listed audio books
export function getAudioBooks(): AudioBook[] {
  return listedBooks.values();
}import { AudioBook, listedBooks } from "./model/bookmodel";
import { User, users } from "./model/usermodel";
import { ContractPromiseBatch, context, u128 } from "near-sdk-as";

// Function to check if the user is logged in
function isLoggedIn(): boolean {
  const user = getUser(context.sender);
  return user && user.loginStatus;
}

// Function to get a user by ID
function getUserById(id: string): User | null {
  return users.get(id);
}

// Function to get an audio book by ID
function getAudioBookById(id: string): AudioBook | null {
  return listedBooks.get(id);
}

// Function to handle user login
export function login(): string {
  const registeredUser = getUser(context.sender);
  if (!registeredUser) {
    return "Wallet Not Signed Up yet";
  }
  registeredUser.loginStatus = true;
  users.set(context.sender, registeredUser);
  return "Logged in successfully";
}

// Function to handle user logout
export function logout(): void {
  const registeredUser = getUser(context.sender);
  if (registeredUser) {
    registeredUser.loginStatus = false;
    users.set(context.sender, registeredUser);
  }
}

// Function to register a new user
export function register(): string {
  const registeredUser = getUser(context.sender);
  if (registeredUser) {
    return "Already Registered";
  }
  users.set(context.sender, User.fromPayload({ id: context.sender, loginStatus: false, profilePic: "/avatar.jpg" }));
  return "User registered successfully";
}

// Function to update user profile picture
export function updateUser(profilePic: string): void {
  const registeredUser = getUser(context.sender);
  if (registeredUser) {
    registeredUser.profilePic = profilePic;
    users.set(context.sender, registeredUser);
  }
}

// Function to delete an audio book
export function deleteAudioBook(id: string): void {
  listedBooks.delete(id);
}

// Function to add a new audio book
export function addAudioBook(audioBook: AudioBook): void {
  if (getAudioBookById(audioBook.id)) {
    throw new Error(`A book with ID ${audioBook.id} already exists`);
  }
  listedBooks.set(audioBook.id, AudioBook.fromPayload(audioBook));
}

// Function to buy an audio book
export function buyAudioBook(audioBookId: string): void {
  if (!isLoggedIn()) {
    throw new Error("Login First");
  }

  const audioBook = getAudioBookById(audioBookId);
  if (!audioBook) {
    throw new Error("Book not found");
  }

  const user = getUser(context.sender);
  if (user && audioBook.owner === context.sender) {
    throw new Error("Cannot buy your own book");
  }

  const attachedDeposit = context.attachedDeposit;
  if (audioBook.price.toString() !== attachedDeposit.toString()) {
    throw new Error("Invalid price");
  }

  ContractPromiseBatch.create(audioBook.owner).transfer(attachedDeposit);

  audioBook.updateOwnerShip();
  audioBook.sellingStatus();
  listedBooks.set(audioBookId, audioBook);
}

// Function to list an audio book for sale
export function listAudioBook(audioBookId: string, price: u128): void {
  if (!isLoggedIn()) {
    throw new Error("Login First");
  }

  const audioBook = getAudioBookById(audioBookId);
  if (!audioBook) {
    throw new Error("Book not found");
  }

  audioBook.updatePrice(price);
  audioBook.sellingStatus();
  listedBooks.set(audioBookId, audioBook);
}

// Function to edit the listing of an audio book
export function editListing(audioBookId: string, price: u128): void {
  if (!isLoggedIn()) {
    throw new Error("Login First");
  }

  const audioBook = getAudioBookById(audioBookId);
  if (!audioBook) {
    throw new Error("Book not found");
  }

  if (audioBook.sellStatus) {
    throw new Error("List the book first");
  }

  audioBook.updatePrice(price);
  listedBooks.set(audioBookId, audioBook);
}

// Function to cancel the listing of an audio book
export function cancelListing(audioBookId: string): void {
  if (!isLoggedIn()) {
    throw new Error("Login First");
  }

  const audioBook = getAudioBookById(audioBookId);
  if (!audioBook) {
    throw new Error("Book not found");
  }

  if (!audioBook.sellStatus) {
    throw new Error("Book not listed");
  }

  audioBook.sellingStatus();
  audioBook.updatePrice(u128.Zero);
  listedBooks.set(audioBookId, audioBook);
}

// Function to get all registered users
export function getUsers(): User[] {
  return users.values();
}

// Function to get all listed audio books
export function getAudioBooks(): AudioBook[] {
  return listedBooks.values();
}
