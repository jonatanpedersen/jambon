import { HttpContext } from "./HttpContext";

export type AsyncReducerFunction = (context : HttpContext) => Promise<HttpContext>;