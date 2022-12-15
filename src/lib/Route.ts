import type { Path } from './Application';
import type { Context, IReplyData } from './Context';

type Handler = (ctx: Context) => IReplyData | Promise<IReplyData>;
type WithProperty<T, K extends string> = T & { [P in K]: string };

const enum RouteMethods {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE',
	PATCH = 'PATCH',
}
class Route {
	identity: string | null = null;
	handler: Handler | null = null;

	constructor(public path: Path = '/', public method: RouteMethods = RouteMethods.GET) {}

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

const route = (...params: ConstructorParameters<typeof Route>) => new Route(...params);
const createRouteFn =
	(method: RouteMethods) =>
	(path: Path = '/') =>
		route(path, method);

export const // Breaks syntax-highlighting, lol
	get = createRouteFn(RouteMethods.GET),
	post = createRouteFn(RouteMethods.POST),
	put = createRouteFn(RouteMethods.PUT),
	del = createRouteFn(RouteMethods.DELETE),
	patch = createRouteFn(RouteMethods.PATCH);

export { Route, Handler, route, RouteMethods };
