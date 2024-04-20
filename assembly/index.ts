/**
 * @file This file contains functions related to user and audio book management.
 */

import { AudioBook, listedBooks } from "./model/bookmodel";
import { User, users } from "./model/usermodel";
import { ContractPromiseBatch, context, u128 } from "near-sdk-as";

/**
 * Logs in the user and updates their login status.
 *
 * @returns A string message indicating the login status.
 */
export function login(): string {
  const registeredUser = getUser(context.sender);
  if (registeredUser == null) {
    return "Wallet Not Signed Up yet";
  }
  registeredUser.loginStatus = true;
  users.set(context.sender, registeredUser);
  return "Logged in successfully";
}

/**
 * Logs out the user and updates their login status.
 */
export function logout(): void {
  const registeredUser = getUser(context.sender);
  if (registeredUser == null) {
    return;
  }
  registeredUser.loginStatus = false;
  users.set(context.sender, registeredUser);
}

/**
 * Registers a new user.
 *
 * @returns A string message indicating the registration status.
 */
export function register(): string {
  const registeredUser = getUser(context.sender);
  if (registeredUser != null) {
    return "Already Registered";
  }
  users.set(context.sender, User.fromPayload({ id: context.sender, loginStatus: false, profilePic: "/avatar.jpg" }));
  return "User registered successfully";
}

/**
 * Updates the user's profile picture.
 *
 * @param profilePic - The new profile picture URL.
 */
export function updateUser(profilePic: string): void {
  const registeredUser = getUser(context.sender);
  if (registeredUser == null) {
    throw new Error("User not found");
  }

  // Validate the profilePic input
  validateProfilePic(profilePic);

  registeredUser.updateUser(profilePic);
  users.set(context.sender, registeredUser);
}

/**
 * Deletes an audio book from the listing.
 *
 * @param id - The ID of the audio book to be deleted.
 */
export function deleteAudioBook(id: string): void {
  listedBooks.delete(id);
}

/**
 * Adds a new audio book to the listing.
 *
 * @param audioBook - The audio book object to be added.
 * @throws Error if an audio book with the same ID already exists.
 */
export function addAudioBook(audioBook: AudioBook): void {
  // Validate the audioBook object
  validateAudioBook(audioBook);

  const storedProduct = listedBooks.get(audioBook.id);
  if (storedProduct !== null) {
    throw new Error(`An audio book with ID ${audioBook.id} already exists`);
  }
  listedBooks.set(audioBook.id, AudioBook.fromPayload(audioBook));
}

/**
 * Retrieves an audio book from the listing.
 *
 * @param id - The ID of the audio book to retrieve.
 * @returns The audio book object, or null if not found or the user is not logged in.
 * @throws Error if the user is not logged in.
 */
export function getAudioBook(id: string): AudioBook | null {
  if (!isUserLoggedIn(context.sender)) {
    throw new Error("Login required");
  }
  return listedBooks.get(id);
}

/**
 * Retrieves all listed audio books.
 *
 * @returns An array of audio book objects.
 * @throws Error if the user is not logged in.
 */
export function getAudioBooks(): AudioBook[] {
  if (!isUserLoggedIn(context.sender)) {
    throw new Error("Login required");
  }
  return listedBooks.values();
}

/**
 * Retrieves a user by their account ID.
 *
 * @param id - The account ID of the user.
 * @returns The user object, or null if not found.
 */
export function getUser(id: string): User | null {
  return users.get(id);
}

/**
 * Retrieves all registered users.
 *
 * @returns An array of user objects.
 */
export function getUsers(): User[] {
  return users.values();
}

/**
 * Buys an audio book from the listing.
 *
 * @param audioBookId - The ID of the audio book to be purchased.
 * @throws Error if the user is not logged in, the book is not found, the attached deposit is incorrect, the book is already sold, or the user is trying to buy their own book.
 */
export function buyAudioBook(audioBookId: string): void {
  if (!isUserLoggedIn(context.sender)) {
    throw new Error("Login required");
  }

  const audioBook = getAudioBook(audioBookId);
  if (audioBook == null) {
    throw new Error("Audio book not found");
  }

  if (audioBook.price.toString() !== context.attachedDeposit.toString()) {
    throw new Error("Invalid price attached");
  }

  if (audioBook.sellStatus) {
    throw new Error("Audio book already sold");
  }

  if (audioBook.owner === context.sender) {
    throw new Error("Cannot buy your own audio book");
  }

  ContractPromiseBatch.create(audioBook.owner).transfer(context.attachedDeposit);

  audioBook.updateOwnership();
  audioBook.sellingStatus();
  listedBooks.set(audioBookId, audioBook);
}

/**
 * Lists an audio book for sale.
 *
 * @param audioBookId - The ID of the audio book to be listed.
 * @param price - The price of the audio book.
 * @throws Error if the user is not logged in, the book is not found, or the user is not the owner of the book.
 */
export function listAudioBook(audioBookId: string, price: u128): void {
  if (!isUserLoggedIn(context.sender)) {
    throw new Error("Login required");
  }

  const audioBook = getAudioBook(audioBookId);
  if (audioBook == null) {
    throw new Error("Audio book not found");
  }

  if (audioBook.owner !== context.sender) {
    throw new Error("You are not the owner of this audio book");
  }

  audioBook.updatePrice(price);
  audioBook.sellingStatus();
  listedBooks.set(audioBookId, audioBook);
}

/**
 * Edits the listing price of an audio book.
 *
 * @param audioBookId - The ID of the audio book to be edited.
 * @param price - The new price of the audio book.
 * @throws Error if the user is not logged in, the book is not found, or the book is not listed for sale.
 */
export function editListing(audioBookId: string, price: u128): void {
  if (!isUserLoggedIn(context.sender)) {
    throw new Error("Login required");
  }

  const audioBook = getAudioBook(audioBookId);
  if (audioBook == null) {
    throw new Error("Audio book not found");
  }

  if (!audioBook.sellStatus) {
    throw new Error("Audio book is not listed for sale");
  }

  audioBook.updatePrice(price);
  listedBooks.set(audioBookId, audioBook);
}

/**
 * Cancels the listing of an audio book.
 *
 * @param audioBookId - The ID of the audio book to be delisted.
 * @throws Error if the user is not logged in, the book is not found, or the book is not listed for sale.
 */
export function cancelListing(audioBookId: string): void {
  if (!isUserLoggedIn(context.sender)) {
    throw new Error("Login required");
  }

  const audioBook = getAudioBook(audioBookId);
  if (audioBook == null) {
    throw new Error("Audio book not found");
  }

  if (!audioBook.sellStatus) {
    throw new Error("Audio book is not listed for sale");
  }

  audioBook.sellingStatus();
  audioBook.updatePrice(u128.Zero);
  listedBooks.set(audioBookId, audioBook);
}

/**
 * Checks if a user is logged in.
 *
 * @param accountId - The account ID of the user.
 * @returns True if the user is logged in, false otherwise.
 */
function isUserLoggedIn(accountId: string): boolean {
  const user = getUser(accountId);
  return user !== null && user.loginStatus;
}

/**
 * Validates the audio book object for any constraints or invalid data.
 *
 * @param audioBook - The audio book object to be validated.
 * @throws Error if the audio book object is invalid or violates any constraints.
 */
function validateAudioBook(audioBook: AudioBook): void {
  // Implement audio book object validation logic here
  // Example: Check if required fields are present, data types are correct, etc.
}

/**
 * Validates the profile picture URL.
 *
 * @param profilePic - The profile picture URL to be validated.
 * @throws Error if the profile picture URL is invalid or violates any constraints.
 */
function validateProfilePic(profilePic: string): void {
  // Implement profile picture URL validation logic here
  // Example: Check if the URL is well-formed, follows a specific pattern, etc.
}
