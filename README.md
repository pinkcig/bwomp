# 🦈 bwomp

a petite framework built on top of fastify

# 📚 examples

```ts
import { bwomp, route } from 'bwomp';

const ping = route()
	.get()
	.identify('ping') // used for logging; optional
	.handle(({ reply }) => ({ message: 'pong', status: 200 }));

const welcome = route()
	.get()
	.identify('welcome')
	.body({ name: 'string' }) // wip
	.handle(({ reply, data }) => ({ message: `${data.name}`, status: 200 }));

await bwomp() //
	.route('/api/v1', ping, welcome)
	.bite(3000);
```
