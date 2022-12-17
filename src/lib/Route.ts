import type { BaseValidator } from '@sapphire/shapeshift';
import type { Path } from './Application';
import type { Context, IReplyData } from './Context';

type WithNonNullableProperty<T, K extends keyof T> = T & { [P in K]: NonNullable<T[P]> };
type ChangePropertyType<T, K extends keyof T, V> = T & { [P in K]: V };
type ValidatedRoute<
	V extends Validation,
	M extends Validation,
	T extends Route<V>,
	K extends 'body' | 'query' | 'params',
> = ChangePropertyType<Route<V & M> & Omit<T, 'handle'>, `${K}Shape`, V[K]>;

const enum RouteMethods {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE',
	PATCH = 'PATCH',
}

type ValidatorDictionary = Record<string, BaseValidator<unknown>>;

interface Validation<
	B extends ValidatorDictionary = ValidatorDictionary,
	Q extends ValidatorDictionary = ValidatorDictionary,
	P extends ValidatorDictionary = ValidatorDictionary,
> {
	body?: B;
	query?: Q;
	params?: P;
}

type Handler<V extends Validation> = (ctx: Context<V>) => IReplyData | Promise<IReplyData>;

class Route<V extends Validation> {
	identity?: string;
	handler?: Handler<V>;

	bodyShape?: V['body'];
	queryShape?: V['query'];
	paramsShape?: V['params'];

	constructor(public path: Path = '/', public method: RouteMethods = RouteMethods.GET) {}

	identify(identity: string) {
		this.identity = identity;

		return this as WithNonNullableProperty<typeof this, 'identity'>;
	}

	handle(handler: Handler<V>) {
		this.handler = handler;

		return this as WithNonNullableProperty<typeof this, 'handler'>;
	}

	body<T extends ValidatorDictionary>(body: T) {
		this.bodyShape = body;

		return this as ValidatedRoute<V, { body: T }, typeof this, 'body'>;
	}

	query<T extends ValidatorDictionary>(query: T) {
		this.queryShape = query;

		return this as ValidatedRoute<V, { query: T }, typeof this, 'query'>;
	}

	params<T extends ValidatorDictionary>(params: T) {
		this.paramsShape = params;

		return this as ValidatedRoute<V, { params: T }, typeof this, 'params'>;
	}
}

const route = (...params: ConstructorParameters<typeof Route>) => new Route(...params);
const createRouteFn =
	(method: RouteMethods) =>
	(path: Path = '/') =>
		route(path, method);

/**
 * Erase type-signature of routes, so that they can be used in the application.
 * TODO: Find a better way to do this.
 */
const $ = (...routes: unknown[]) => routes as Route<Validation>[];

const // Breaks syntax-highlighting, lol
	get = createRouteFn(RouteMethods.GET),
	post = createRouteFn(RouteMethods.POST),
	put = createRouteFn(RouteMethods.PUT),
	del = createRouteFn(RouteMethods.DELETE),
	patch = createRouteFn(RouteMethods.PATCH);

export { Route, Handler, route, RouteMethods, Validation, ValidatorDictionary, get, post, put, del, patch, $ };
