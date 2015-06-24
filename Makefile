.PHONY: build test test_server

# variables
BIN=./node_modules/.bin

# default
all: build test

#
# Tasks
#
build:
	$(BIN)/babel lib_es6 --out-dir lib --modules common

test:
	npm test

test_server:
	$(BIN)/static ./test/build
