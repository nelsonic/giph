test: test-unit test-integration

test-unit:
	./node_modules/.bin/mocha ./setupTests.js ./lib/**/*.spec.js

test-integration:
	./node_modules/.bin/mocha ./setupTests ./lib/**/*.integration.js
