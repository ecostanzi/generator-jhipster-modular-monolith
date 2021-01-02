# generator-jhipster-modular-monolith
[![NPM version][npm-image]][npm-url] [![Build Status][github-actions-image]][github-actions-url] [![Dependency Status][daviddm-image]][daviddm-url]
> A JHipster blueprint to organize entities in a modular way

# Introduction

This is a [JHipster](https://www.jhipster.tech/) blueprint, that is meant to be used in a JHipster application.

With this blueprint it's possible to define an optional `module` for each entity. All the entities in the same modules
will be grouped in the same package.

```
com.mycompany.myapp.modules
    ├── invoice //invoice module
    │   ├── config
    │   ├── domain
    │   │   └── enumeration
    │   ├── repository
    │   ├── service
    │   └── web
    │       └── rest
    ├── notification //notification module
    │   ├── config
    │   ├── domain
    │   │   └── enumeration
    │   ├── repository
    │   └── web
    │       └── rest
    └── store //store module
        ├── config
        ├── domain
        │   └── enumeration
        ├── repository
        ├── service
        └── web
            └── rest
```

This is useful when:
- you want to group entity by a specific domain/architecture concept
- you want to enforce separation of concerns without using microservices (but you may need them later)

# Prerequisites

As this is a [JHipster](https://www.jhipster.tech/) blueprint, we expect you have JHipster and its related tools already installed:

- [Installing JHipster](https://www.jhipster.tech/installation/)

# Usage

To use this blueprint, run the below commands

```bash
npm install -g generator-jhipster-modular-monolith
jhipster --blueprints modular-monolith
```

Now you can group entities and their related files into an isolated module package. You can create entities:

#### Via JDL

```
@module(invoice)
entity Shipment {
    name String required
}
```

#### Via command line

```
$ jhipster entity Shipment
The entity Customer is being created.

? Do you want to add your entity to a module? Yes
? What's the module name for your entity? invoice

```

### Skip Rest Controller

You can also decide to skip the generation of the REST controller for your entity.

#### Via command line

```
? Do you want to generate a REST controller for your entity? (Use arrow keys)
> Yes, generate the REST controller as usual
  No, skip the generation of the REST controller
```

#### Via JDL

```
@skipRest
entity Shipment {
    name String required
}
```

## Running local Blueprint version for development

During development of blueprint, please note the below steps. They are very important.

1. Link your blueprint globally 

Note: If you do not want to link the blueprint(step 3) to each project being created, use NPM instead of Yarn as yeoman doesn't seem to fetch globally linked Yarn modules. On the other hand, this means you have to use NPM in all the below steps as well.

```bash
cd generator-jhipster-modular-monolith
npm link
```

2. Link a development version of JHipster to your blueprint (optional: required only if you want to use a non-released JHipster version, like the master branch or your own custom fork)

You could also use Yarn for this if you prefer

```bash
cd generator-jhipster-generator-jhipster
npm link

cd generator-jhipster-modular-monolith
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
