import { s } from '@sapphire/shapeshift';
import { post } from './lib';

export * from './lib';

function formatAge(age: number) {
	return age > 1 ? `${age} years old` : `${age} year old`;
}

post('/') //
	.identify('home')
	.body({ name: s.string, age: s.number })
	.handle(({ body: { name, age } }) => {
		return { data: `Hello ${name}, you're ${formatAge(age)}` };
	});
