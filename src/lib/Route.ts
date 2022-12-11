import type { Path } from './App';
import type { Context, IReplyData } from './Context';

type Handler = (ctx: Context) => IReplyData | Promise<IReplyData>;
type WithProperty<T, K extends string> = T & { [P in K]: string };

class Route {
	method: string | null = null;
	identity: string | null = null;
	handler: Handler | null = null;

	constructor(public path: Path = '/') {}

	// TODO: Improve this
	get() {
		this.method = 'GET';

		return this as WithProperty<typeof this, 'method'>;
	}

	post() {
		this.method = 'POST';

		return this as WithProperty<typeof this, 'method'>;
	}

	put() {
		this.method = 'PUT';

		return this as WithProperty<typeof this, 'method'>;
	}

	delete() {
		this.method = 'DELETE';

		return this as WithProperty<typeof this, 'method'>;
	}

	patch() {
		this.method = 'PATCH';

		return this as WithProperty<typeof this, 'method'>;
	}

	identify(identity: string) {
		this.identity = identity;

		return this as WithProperty<typeof this, 'identity'>;
	}

	handle(handler: Handler) {
		this.handler = handler;

		return this as WithProperty<typeof this, 'handler'>;
	}

	// TODO: Add validation; it should be strictly typed (future me: try abusing intersectin types and generics)
}

const route = (path: Path = '/') => new Route(path);

export { Route, Handler, route };
