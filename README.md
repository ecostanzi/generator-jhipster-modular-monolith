# generator-jhipster-modular-monolith
[![NPM version][npm-image]][npm-url] [![Build Status][github-actions-image]][github-actions-url] [![Dependency Status][daviddm-image]][daviddm-url]
> JHipster blueprint, A Jhipster blueprint to organize entities in a modular way

# Introduction

This is a [JHipster](https://www.jhipster.tech/) blueprint, that is meant to be used in a JHipster application.

# Prerequisites

As this is a [JHipster](https://www.jhipster.tech/) blueprint, we expect you have JHipster and its related tools already installed:

- [Installing JHipster](https://www.jhipster.tech/installation/)

# Installation

## With NPM

To install this blueprint:

```bash
npm install -g generator-jhipster-modular-monolith
```

To update this blueprint:

```bash
npm update -g generator-jhipster-modular-monolith
```

## With Yarn

To install this blueprint:

```bash
yarn global add generator-jhipster-modular-monolith
```

To update this blueprint:

```bash
yarn global upgrade generator-jhipster-modular-monolith
```

# Usage

To use this blueprint, run the below command

```bash
jhipster --blueprint modular-monolith
```


## Running local Blueprint version for development

During development of blueprint, please note the below steps. They are very important.

1. Link your blueprint globally 

Note: If you do not want to link the blueprint(step 3) to each project being created, use NPM instead of Yarn as yeoman doesn't seem to fetch globally linked Yarn modules. On the other hand, this means you have to use NPM in all the below steps as well.

```bash
cd modular-monolith
npm link
```

2. Link a development version of JHipster to your blueprint (optional: required only if you want to use a non-released JHipster version, like the master branch or your own custom fork)

You could also use Yarn for this if you prefer

```bash
cd generator-jhipster
npm link

cd modular-monolith
npm link generator-jhipster
```

3. Create a new folder for the app to be generated and link JHipster and your blueprint there

```bash
mkdir my-app && cd my-app

npm link generator-jhipster-modular-monolith
npm link generator-jhipster (Optional: Needed only if you are using a non-released JHipster version)

jhipster -d --blueprint modular-monolith

```

# License

Apache-2.0 © [Enrico Costanzi]()


[npm-image]: https://img.shields.io/npm/v/generator-jhipster-modular-monolith.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-modular-monolith
[github-actions-image]: https://github.com/ecostanzi/generator-jhipster-modular-monolith/workflows/Build/badge.svg
[github-actions-url]: https://github.com/ecostanzi/generator-jhipster-modular-monolith/actions
[daviddm-image]: https://david-dm.org/ecostanzi/generator-jhipster-modular-monolith.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/ecostanzi/generator-jhipster-modular-monolith
