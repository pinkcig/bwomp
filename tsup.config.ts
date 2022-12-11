import { defineConfig } from 'tsup';

export default defineConfig({
	globalName: 'bwomp',
	target: 'esnext',
	tsconfig: 'tsconfig.json',

	entry: ['src/**/*.ts'],
	format: ['esm', 'cjs'],

	sourcemap: true,
	splitting: true,
	clean: true,
	dts: true,
	minify: true,
	skipNodeModulesBundle: true,
});
