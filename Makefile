npm_bin= `npm bin`

all: test
install:
	@npm i
test: install
	@NODE_ENV=test $(BIN) $(FLAGS) \
		${npm_bin}/istanbul cover	${npm_bin}/_mocha --report lcovonly
travis: server
	@${npm_bin}/macaca doctor
	@${npm_bin}/macaca run
server: install
	@${npm_bin}/startserver -s -p 4567 &
.PHONY: test
