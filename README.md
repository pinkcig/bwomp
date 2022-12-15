# 🦈 bwomp

<!-- Put .github/assets/bwomp.png image here  -->
<!-- 
<img src=".github/assets/bwomp.png" width="200" height="200" />

a petite framework built on top of fastify -->

<div align="center">
	<img src=".github/assets/bwomp.png" width="200" height="200" />
	<p>a petite framework built on top of fastify</p>
</div>

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
