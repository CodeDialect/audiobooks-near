import { PersistentUnorderedMap, context } from "near-sdk-as";

@nearBindgen
export class User {
  id: string;
  loginStatus: boolean;
  profilePic: string;
  public static fromPayload(payload: User): User {
    const user = new User();
    user.id = context.sender;
    user.profilePic = payload.profilePic;
    return user;
  }

  public updateUser(profilePic: string): void {
    this.profilePic = profilePic;
  }
}

export const users = new PersistentUnorderedMap<string, User>("Users");
