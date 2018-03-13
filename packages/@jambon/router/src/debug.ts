import debug from 'debug';

export function createDebug (namespace: string) {
	return debug(namespace);
}