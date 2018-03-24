import { HttpContext } from "./HttpContext";

export function updateContext (context : HttpContext, update : object) : HttpContext {
	return updateObj(context, update);
}

function updateObj (obj : object, update : object) : any {
	if (obj === undefined || typeof obj !== typeof update) {
		return update;
	}

	for (const prop in update) {
		const isObject = typeof update[prop] === 'object';
		const isNotNull = update[prop] !== null;
		const isNotArray = !Array.isArray(update[prop]);
		const newValue = isObject && isNotNull && isNotArray
			? updateObj(obj[prop], update[prop])
			: update[prop];

		obj = { ...obj, [prop]: newValue };
	}

	return obj;
}
