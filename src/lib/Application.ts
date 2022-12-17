import { Logger } from '@pinkcig/console';
import { fastify, HTTPMethods, type FastifyInstance, type FastifyServerOptions } from 'fastify';
import { Context } from './Context';

import type { Route, Validation } from './Route';

/**
 * The options for the Application
 */
interface IAppOptions {
	/**
	 * The port to listen on
	 */
	port?: number;

	/**
	 * The options to pass to Fastify
	 * @see https://www.fastify.io/docs/latest/Reference/TypeScript
	 */
	fastifyOptions?: FastifyServerOptions;
}

/**
 * A path, with a leading slash
 * @example '/api'
 * @example '/api/v1'
 */
type Path = `/${string}`;

/**
 * The main application class
 * @example
 * ```ts
 * await new Application()
 * 	.route('/api', new Route('/').get().handle(ctx => ({ status: 200, message: 'Hello, world!' })))
 * 	.bite();
 * ```
 * @example
 * ```ts
 * // With utility functions
 * await bwomp()
 * 	.route('/api', get('/).handle(ctx => ({ status: 200, message: 'Hello, world!' })))
 * 	.bite();
 * ```
 */
class Application {
	#logger = new Logger({ name: 'server' });
	#server: FastifyInstance;
	#port: number;

	constructor({ port = 3000, fastifyOptions = {} }: IAppOptions = {}) {
		this.#server = fastify(fastifyOptions);
		this.#port = port;
	}

	/**
	 * Register a route
	 * @param baseURL The base URL for the route
	 * @param routes The routes to register
	 * @example
	 * ```ts
	 * <Application>.route('/api', get('/').handle(ctx => ({ status: 200, message: 'Hello, world!' })));
	 * ```
	 */
	route(baseURL: Path, ...routes: Route<Validation>[]) {
		/**
		 * For each handler, register its baseURL + handler.path
		 */
		for (const route of routes) {
			const { path, method, handler } = route;

			if (!method) {
				this.#logger.error(`No method specified for ${baseURL + path}`);
				continue;
			}

			if (!handler) {
				this.#logger.error(`No handler specified for ${method} ${baseURL + path}`);
				continue;
			}

			this.#server.route({
				url: baseURL + (path === '/' ? '' : path),
				method: method as unknown as HTTPMethods,
				handler: async (request, reply) => {
					const result = await handler!(
						new Context({
							request,
							route,

							bodyShape: route.bodyShape,
							queryShape: route.queryShape,
							paramsShape: route.paramsShape,
							response: reply,
							app: this,
						}),
					);

					result.message ??= 'OK';
					result.status ??= 200;

					reply.status(result.status).send(result);
				},
			});
		}

		return this;
	}

	/**
	 * Start listening on the specified port
	 * @param port The port to listen on
	 * @example
	 * ```ts
	 * await <Application>.bite();
	 * ```
	 */
	async bite(port: number = this.#port) {
		await this.#server.listen({ port });

		this.#logger.info(`listening on port ${port} 🦈`);
	}
}

/**
 * An alias for `new Application()`
 */
const bwomp = (options: IAppOptions = {}) => new Application(options);

export { Application, IAppOptions, Path, bwomp };
