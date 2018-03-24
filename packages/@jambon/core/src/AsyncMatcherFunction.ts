import { HttpContext } from "./HttpContext";
export type AsyncMatcherFunction = (context : HttpContext) => Promise<boolean>;
