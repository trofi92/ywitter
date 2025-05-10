import { User } from "firebase/auth";

export interface AppState {
 isLoggedIn: boolean;
 init: boolean;
 userObj: User | null;
}

export type AppAction =
 | { type: "SET_LOGGED_IN"; payload: boolean }
 | { type: "SET_INIT"; payload: boolean }
 | { type: "SET_USER"; payload: User | null };
