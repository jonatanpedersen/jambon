import 'mocha';
import {describeAsyncReducer, noop} from '@jambon/test-helpers';
import {expect} from 'chai';
import {path} from '../';

describeAsyncReducer({
	description: 'matching path without params',
	asyncReducer: path('/foos', noop()),
	initialState: {
		request: {
			method: 'GET',
			headers: {},
			url: '/foos'
		},
		context: {
		}
	},
	expectedFinalState: {
		request: {
			method: 'GET',
			headers: {},
			url: '/foos',
			params: {}
		},
		response: {
			statusCode: 200
		},
		context: {
		}
	}
});

describeAsyncReducer({
	description: 'non matching path without params',
	asyncReducer: path('/foos', noop()),
	initialState: {
		request: {
			method: 'GET',
			headers: {},
			url: '/bars'
		},
		context: {
		}
	},
	expectedFinalState: {
		request: {
			method: 'GET',
			headers: {},
			url: '/bars'
		},
		context: {
		}
	}
});

describeAsyncReducer({
	description: 'matching path with params',
	asyncReducer: path('/foos/:id', noop()),
	initialState: {
		request: {
			method: 'GET',
			headers: {},
			url: '/foos/1'
		},
		context: {
		}
	},
	expectedFinalState: {
		request: {
			method: 'GET',
			headers: {},
			url: '/foos/1',
			params: {
				id: '1'
			}
		},
		response: {
			statusCode: 200
		},
		context: {
		}
	}
});

describeAsyncReducer({
	description: 'non matching path with params',
	asyncReducer: path('/foos/:id', noop()),
	initialState: {
		request: {
			method: 'GET',
			headers: {},
			url: '/bars'
		},
		context: {
		}
	},
	expectedFinalState: {
		request: {
			method: 'GET',
			headers: {},
			url: '/bars'
		},
		context: {
		}
	}
});

describeAsyncReducer({
	description: 'matching absolute path',
	asyncReducer: path('/foos', noop()),
	initialState: {
		request: {
			method: 'GET',
			headers: {},
			url: '/foos'
		},
		context: {
		}
	},
	expectedFinalState: {
		request: {
			method: 'GET',
			params: {},
			headers: {},
			url: '/foos'
		},
		response: {
			statusCode: 200
		},
		context: {
		}
	}
});

describeAsyncReducer({
	description: 'non matching absolute path',
	asyncReducer: path('/foos', noop()),
	initialState: {
		request: {
			method: 'GET',
			headers: {},
			url: '/bars'
		},
		context: {
		}
	},
	expectedFinalState: {
		request: {
			method: 'GET',
			headers: {},
			url: '/bars'
		},
		context: {
		}
	}
});

describeAsyncReducer({
	description: 'matching relative path',
	asyncReducer: path('foos', noop()),
	initialState: {
		request: {
			method: 'GET',
			headers: {},
			url: '/foos'
		},
		context: {
		}
	},
	expectedFinalState: {
		request: {
			method: 'GET',
			params: {},
			headers: {},
			url: '/foos'
		},
		response: {
			statusCode: 200
		},
		context: {
		}
	}
});

describeAsyncReducer({
	description: 'matching absolute path and matching relative path',
	asyncReducer: path('/foos', path('bars', noop())),
	initialState: {
		request: {
			method: 'GET',
			headers: {},
			url: '/foos/bars'
		},
		context: {
		}
	},
	expectedFinalState: {
		request: {
			method: 'GET',
			params: {},
			headers: {},
			url: '/foos/bars'
		},
		response: {
			statusCode: 200
		},
		context: {
		}
	}
});

describeAsyncReducer({
	description: 'matching relative path and matching relative path',
	asyncReducer: path('foos', path('bars', noop())),
	initialState: {
		request: {
			method: 'GET',
			headers: {},
			url: '/foos/bars'
		},
		context: {
		}
	},
	expectedFinalState: {
		request: {
			method: 'GET',
			params: {},
			headers: {},
			url: '/foos/bars'
		},
		response: {
			statusCode: 200
		},
		context: {
		}
	}
});

describeAsyncReducer({
	description: 'matching absolute path and matching absolute path',
	asyncReducer: path('/foos', path('/foos/bars', noop())),
	initialState: {
		request: {
			method: 'GET',
			headers: {},
			url: '/foos/bars'
		},
		context: {
		}
	},
	expectedFinalState: {
		request: {
			method: 'GET',
			params: {},
			headers: {},
			url: '/foos/bars'
		},
		response: {
			statusCode: 200
		},
		context: {
		}
	}
});