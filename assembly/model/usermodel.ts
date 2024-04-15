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
    user.loginStatus = false;
    return user;
  }

  public updateUser(profilePic: string): void {
    this.profilePic = profilePic;
  }

  public login(): void {
    this.loginStatus = true;
  }

  public logout(): void {
    this.loginStatus = false;
  }
}

export const users = new PersistentUnorderedMap<string, User>("Users");

export function addUser(user: User): void {
  const userId = user.id;
  const isRegistered = users.contains(userId);
  if (!isRegistered) {
    users.set(userId, User.fromPayload(user));
  } else {
    throw new Error("User already registered.");
  }
}

export function getUser(id: string): User | null {
  return users.get(id);
}

export function removeUser(id: string): void {
  if (users.contains(id)) {
    users.remove(id);
  } else {
    throw new Error("User not found.");
  }
}