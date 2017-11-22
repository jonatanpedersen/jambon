export default async function* iterableCursor (cursor) {
	try {
		cursor[Symbol.asyncIterator] = () => {};

		while (await cursor.hasNext()) {
			yield await cursor.next();
		}
	} finally {
		await cursor.close();
	}
}