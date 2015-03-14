all: test
install:
	@npm install
clean:
	@rm -rf build
test: install
	@node --harmony \
		node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha \
		-- \
		--timeout 10000 \
		--require co-mocha
travis: install
	@NODE_ENV=test ./node_modules/.bin/istanbul cover \
		./node_modules/.bin/_mocha \
		--report lcovonly \
		-- -t 20000 -r should-http test/*.test.js
build:
	@./node_modules/bower/bin/bower install
static: build
	@node ./node_modules/webpack/bin/webpack.js ./assets
jshint:
	@./node_modules/jshint/bin/jshint .
server: install
	@./node_modules/startserver/bin/startserver
slide:
	@./node_modules/startserver/bin/startserver -g README.md
.PHONY: test
