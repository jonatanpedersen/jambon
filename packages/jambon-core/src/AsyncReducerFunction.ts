import { HttpState } from "./HttpState";

export type AsyncReducerFunction = (state : HttpState) => Promise<HttpState>;