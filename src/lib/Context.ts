import { BaseValidator, s } from '@sapphire/shapeshift';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Application } from './Application';
import type { Route, Validation } from './Route';

// InferType wouldn't work here so we have to improvise.
type UnwrapValidator<T extends BaseValidator<unknown>> = T extends BaseValidator<infer V> ? V : never;
type UnwrapValidatorDictionary<T extends Record<string, BaseValidator<unknown>>> = {
	[P in keyof T]: UnwrapValidator<T[P]>;
};

/**
 * The reply data interface
 */
interface IReplyData {
	/**
	 * The data to send
	 */
	data: unknown;

	/**
	 * The message to send
	 * @default 'OK'
	 */
	message?: string;

	/**
	 * The status code to send
	 * @default 200
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
	 */
	status?: number;
}

interface IContextOptions<V extends Validation> {
	app: Application;
	route: Route<V>;
	request: FastifyRequest;
	response: FastifyReply;

	bodyShape: V['body'];
	queryShape: V['query'];
	paramsShape: V['params'];
}

class Context<V extends Validation> {
	#app: Application;
	#route: Route<V>;
	#request: FastifyRequest;
	#response: FastifyReply;

	body!: UnwrapValidatorDictionary<NonNullable<V['body']>>;
	query!: UnwrapValidatorDictionary<NonNullable<V['query']>>;
	params!: UnwrapValidatorDictionary<NonNullable<V['params']>>;

	constructor({ app, route, request, response, bodyShape, queryShape, paramsShape }: IContextOptions<V>) {
		this.#app = app;
		this.#route = route;
		this.#request = request;
		this.#response = response;

		if (bodyShape) this.body = s.object(bodyShape).parse(request.body);
		if (queryShape) this.query = s.object(queryShape).parse(request.query);
		if (paramsShape) this.params = s.object(paramsShape).parse(request.params);
	}

	get app() {
		return this.#app;
	}

	get route() {
		return this.#route;
	}

	get request() {
		return this.#request;
	}

	get response() {
		return this.#response;
	}
}

export { Context, IReplyData };
