import { User } from "firebase/auth";

//v9패치로 필요없어졌지만 타입 확장에 대한 학습의 흔적으로 남겨둠
export interface ExtendedUser extends User {
 updateProfile: (profile: {
  displayName?: string;
  photoURL?: string;
 }) => Promise<void>;
}

export interface AppState {
 init: boolean;
 userObj: User | null;
}

export type AppAction =
 | { type: "SET_INIT"; payload: boolean }
 | { type: "SET_USER"; payload: User | null };
