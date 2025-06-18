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

export type State = {
 email: string;
 password: string;
 newAccount: boolean;
 error: string;
};

export type Action =
 | { type: "SET_EMAIL"; payload: string }
 | { type: "SET_PASSWORD"; payload: string }
 | { type: "SET_NEW_ACCOUNT"; payload: boolean }
 | { type: "SET_ERROR"; payload: string };

export const initialState: State = {
 email: "",
 password: "",
 newAccount: true,
 error: "",
};

export const reducer = (state: State, action: Action): State => {
 switch (action.type) {
  case "SET_EMAIL":
   return { ...state, email: action.payload };
  case "SET_PASSWORD":
   return { ...state, password: action.payload };
  case "SET_NEW_ACCOUNT":
   return { ...state, newAccount: action.payload };
  case "SET_ERROR":
   return { ...state, error: action.payload };

  default:
   return state;
 }
};
