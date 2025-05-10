import { User } from "firebase/auth";

// 리듀서 타입 정의
export type Reducer<S, A> = (state: S, action: A) => S;

// 액션 페이로드 타입 정의
export type ActionPayload =
 | string
 | number
 | boolean
 | null
 | User
 | Record<string, string | number | boolean | null>;

// 리듀서 액션 타입 정의
export type ReducerAction<T extends string, P = ActionPayload> = {
 type: T;
 payload: P;
};

// 리듀서 디스패치 타입 정의
export type ReducerDispatch<A> = (action: A) => void;

// 리듀서 훅 타입 정의
export type ReducerHook<S, A> = () => [S, ReducerDispatch<A>];
