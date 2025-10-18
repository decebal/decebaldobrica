---
title: Software Architecture Head Spaces
date: '2019-09-04T05:00:00.000Z'
author: Decebal D.
description: Topics in Software Architecture I am currently pondering and distilling.
tags:
  - software-architecture
  - evolutionary-architecture
  - serverless2.0
  - DDD
  - graphql
slug: 2019-09-04-software-arhitecture-head-spaces
canonicalUrl: >-
  https://decebalonprogramming.net/post/2019-09-04-software-arhitecture-head-spaces
---

Software Architecture topics
---

## Building Evolutionary Architectures [#evolutionary-architecture](/tags/evolutionary-architecture)

- fitness functions
- fitness functions for Serverless architectures
- monitoring evolution with fitness functions
- when to use **safe deployments** ?
- using bounded contexts inside a Serverless architecture. is it worth further segregating layers ? 
- takeaways form the book: "Building Evolutionary Architectures" from O'reilly, authored by *Neal Ford, Rebecca Parsons and Patrick Kua*

## Serverless 2.0 [#serverless2.0](/tags/serverless2.0)

- using serverless.com with kubeless
- OpenFaas vs kubeless
- gitlab integrations (has one with kubeless)
- monorepo of domain functions
- polyglot monorepo
- A Comparison of Serverless Frameworks for Kubernetes: OpenFaas, OpenWhisk, Fission, Kubeless and more

## Building Evolutionary Architectures with Serverless 2.0

- support for monitoring fitness functions out of the box
- e2e tests inside a CI box

## Domain Driven Design Tools for Typescript and Serverless [#DDD](/tags/DDD)

- defining types and tested domains in TS similar to [value objects in php](https://github.com/funeralzone/valueobjects)
- generating types and tested domains based on a/some config file(s) similar to [value objects generator in php](https://github.com/funeralzone/valueobject-generator)
- [monorepo generator](https://github.com/decebal/generator-mono-serverless), work in progress on a yeoman enhanced generator with DDD
- [mixins](https://www.bryntum.com/blog/the-mixin-pattern-in-typescript-all-you-need-to-know/) and [Data Class](https://github.com/alexeyraspopov/dataclass/blob/master/README.md) for better defining Ubiquitous Language in TypeScript
- takeaways from [Khalil Stemmler's blog posts on DDD](https://khalilstemmler.com/articles/tags/ddd/)
- review "Domain Driven Distilled" by *Vaughn Vernon*

## GraphQl [#graphql](/tags/graphql)

- generate a graphQl gateway layer to put in place of an existing Rest Api
- contract testing with GraphQl
- using graphql for defining Ubiquitous Language
- use graphql to define domain layers, in particular the graphql schema
