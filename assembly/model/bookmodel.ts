import { PersistentUnorderedMap, u128, context } from "near-sdk-as";

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
    public updateOwnerShip (): void {
        this.owner = context.sender;
    }
    
    public sellingStatus (): void {
        this.sellStatus = !this.sellStatus;
    }

    public updatePrice (price: u128): void {
        this.price = price;
    }
}

export const listedBooks = new PersistentUnorderedMap<string, AudioBook>("LISTED_BOOKS");