import { Logger } from '@pinkcig/console';
import { fastify, HTTPMethods, type FastifyInstance, type FastifyServerOptions } from 'fastify';
import { Context } from './Context';
import type { Route } from './Route';

interface IAppOptions {
	port?: number;
	fastifyOptions?: FastifyServerOptions;
}

class Application {
	#logger = new Logger({ name: 'server' });
	#server: FastifyInstance;
	#port: number;

	constructor({ port = 3000, fastifyOptions = {} }: IAppOptions = {}) {
		this.#server = fastify(fastifyOptions);
		this.#port = port;
	}

	route(baseURL: string, ...routes: Route[]) {
		/**
		 * For each handler, register its baseURL + handler.path
		 */
		for (const route of routes) {
			const { path, method, handler } = route;

			this.#server.route({
				url: baseURL + path,
				method: method as HTTPMethods,
				handler: async (request, reply) => {
					const result = await handler!(new Context(this, route, request, reply));
					reply.status(result.status).send(result);
				},
			});
		}

		return this;
	}

	async bite(port: number = this.#port) {
		await this.#server.listen({ port });

		this.#logger.info(`listening on port ${port} 🦈`);
	}
}

const bwomp = (options: IAppOptions = {}) => new Application(options);

export { Application, IAppOptions, bwomp };
