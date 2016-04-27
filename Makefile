current_version = $$(git branch 2>/dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/')
npm_bin= $$(npm bin)

all: test
install:
	@npm install
clean:
	@rm -rf build
test: install
	@NODE_ENV=test $(BIN) $(FLAGS) \
		${npm_bin}/istanbul cover	${npm_bin}/_mocha --report lcovonly
travis: test server
	@${npm_bin}/macaca run --no-window
lint:
	@${npm_bin}/eslint lib homepage test
server: install
	@${npm_bin}/startserver -s -p 4567 &
build:
	@${npm_bin}/babel lib/ --out-dir dist/
.PHONY: test
