christine.fyi Blog Theme
========================


## Setup

First, [install NVM](https://github.com/nvm-sh/nvm)

Then install the correct node version:

```sh
nvm install
```

Enable corepack, install packages, and add yarn PnP support:

```sh
corepack enable
yarn install
yarn dlx @yarnpkg/sdks base
```
