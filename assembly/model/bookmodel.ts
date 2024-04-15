import { PersistentUnorderedMap, u128, context, ContractPromiseBatch, context } from "near-sdk-as";

@nearBindgen
export class AudioBook {
  id: string;
  title: string;
  description: string;
  image: string;
  audio: string;
  price: u128;
  owner: string;
  sellStatus: boolean;

  public static fromPayload(payload: AudioBook): AudioBook {
    const audioBook = new AudioBook();
    audioBook.id = payload.id;
    audioBook.title = payload.title;
    audioBook.description = payload.description;
    audioBook.image = payload.image;
    audioBook.audio = payload.audio;
    audioBook.price = payload.price;
    audioBook.owner = context.sender;
    audioBook.sellStatus = false;
    return audioBook;
  }

  public updateOwnership(): void {
    this.owner = context.sender;
  }

  public sellingStatus(): void {
    this.sellStatus = !this.sellStatus;
  }

  public updatePrice(price: u128): void {
    this.price = price;
  }

  public buyBook(buyerAddress: string): void {
    const buyer = context.sender;
    const seller = this.owner;
    if (buyer != seller) {
      ContractPromiseBatch.create(seller).transfer(this.price);
      this.owner = buyer;
      this.sellStatus = false;
    } else {
      throw new Error("You cannot buy your own book.");
    }
  }
}

export const listedBooks = new PersistentUnorderedMap<string, AudioBook>("LISTED_BOOKS");

export function addAudioBook(audioBook: AudioBook): void {
  const audioBookId = audioBook.id;
  const isListed = listedBooks.contains(audioBookId);
  if (!isListed) {
    listedBooks.set(audioBookId, AudioBook.fromPayload(audioBook));
  } else {
    throw new Error("Audio book with this ID already exists.");
  }
}

export function getAudioBook(id: string): AudioBook | null {
  return listedBooks.get(id);
}

export function removeAudioBook(id: string): void {
  if (listedBooks.contains(id)) {
    listedBooks.remove(id);
  } else {
    throw new Error("Audio book with this ID does not exist.");
  }
}