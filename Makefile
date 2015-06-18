git_version = $$(git branch 2>/dev/null | sed -e '/^[^*]/d'-e's/* \(.*\)/\1/')
npm_bin= $$(npm bin)

all: test
install:
	@npm install
clean:
	@rm -rf build
test: install
	@node --harmony \
		${npm_bin}/istanbul cover ${npm_bin}/_mocha \
		-- \
		--timeout 10000 \
		--require co-mocha
travis: install
	@NODE_ENV=test ${npm_bin}/istanbul cover \
		./node_modules/.bin/_mocha \
		--report lcovonly \
		-- -t 20000 -r should-http test/*.test.js
pull:
	@git pull origin ${git_version}
push:
	@git push origin ${git_version}
lint:
	@${npm_bin}/eslint lib homepage
server: install
	@${npm_bin}/startserver
slide:
	@${npm_bin}/startserver generate README.md
.PHONY: test
