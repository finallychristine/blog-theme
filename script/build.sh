#!/bin/bash
rm -rf dist/
rollup -c --environment BUILD:production
cd dist/build && zip -r ../wind.zip .
