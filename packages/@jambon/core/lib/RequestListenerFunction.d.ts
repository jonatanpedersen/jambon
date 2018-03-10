/// <reference types="node" />
import { IncomingMessage, ServerResponse } from "http";
export declare type RequestListenerFunction = (req: IncomingMessage, res: ServerResponse) => void;
