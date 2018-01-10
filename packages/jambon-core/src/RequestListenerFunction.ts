import { IncomingMessage, ServerResponse } from "http";

export type RequestListenerFunction = (req: IncomingMessage, res: ServerResponse) => void;
