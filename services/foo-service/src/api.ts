import bars from './bars';
import foos from './foos';
import {path, get, post} from 'jambon-router';
import {parseRequestBody, jsonResponse} from 'jambon-core';

export default function ({db}) {
	return path('/api',
		post(parseRequestBody),
		...foos({db}),
		...bars(),
		jsonResponse
	);
}