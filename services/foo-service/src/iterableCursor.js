export default async function* iterableCursor (cursor) {
	try {
		while (await cursor.hasNext()) {
			yield await cursor.next();
		}
	} finally {
		await cursor.close();
	}
}