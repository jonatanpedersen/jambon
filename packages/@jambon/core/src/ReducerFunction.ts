import { HttpContext } from "./HttpContext";

export type ReducerFunction = (context : HttpContext) => HttpContext;