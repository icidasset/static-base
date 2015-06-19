.PHONY: build

# variables
BIN=./node_modules/.bin

# default
all: build

#
# Tasks
#
build:
	$(BIN)/babel lib_es6 --out-dir lib --modules common
