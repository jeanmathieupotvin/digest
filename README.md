# digest

[![test](https://github.com/jeanmathieupotvin/digest/actions/workflows/npm-test.yml/badge.svg?branch=main)](https://github.com/jeanmathieupotvin/digest/actions/workflows/npm-test.yml)

A digestive for data structures constructed from results stemming from
[Viome](https://www.viome.com/) Gut Intelligence Test® kits.

# Disclaimer

I am not affiliated to Viome® in any way. I built this package to make it easier
to search and manipulate my own personal results.

*Viome*® and *Viome Gut Intelligence Test*® are registered trademarks. Buy your
own kit online from their [online store](https://www.viome.com/products/gut-intelligence).

# Description

Package `digest` lets you construct collections of `Food` objects and
efficiently search, filter and sort them. It has built-in data parsers and
validators, and can sanitize queries passed to the collection. It is an
appropriate tool to better use and explore your Viome® personal results.

# Installation

The package is not published on `npm`. I thought it was too specific to be
published. Instead, users can clone this repo into their project.

```bash
git clone https://github.com/jeanmathieupotvin/digest
```

Alternatively, they can download an
[official release](https://github.com/jeanmathieupotvin/digest/releases) from
this repository.

# Usage

Package `digest` relies on an array of objects, each representing a food. It
has the following structure.

```js
{
    alias:   "string - a unique ID",
    imgFile: "string - a file name of an image of the food",
    foodEn:  "string - a name in English",
    foodFr:  "string - a name in French",
    serving: "string - recommended serving by Viome®",
    catPer1: "string - standardized Viome® category for person 1",
    catPer2: "string - standardized Viome® category for person 2",
}
```

This data structure is designed to hold food categories of two persons. You
will notice that in the source code, keys `catPer1` and `catPer2` are actually
named `catJm` and `catRen`. In future versions, I will automate a way to change
these keys easily. In the meantime, you can change them in the source code
directly.

## Classes Food and FoodCollection

The data structure above is formalized by class `Food`. `Food` instances are
grouped together through class `FoodCollection`. The latter extends class
`Array` and provides additional methods to easily search, filter and sort the
collection. The main interface to the collection, aside from the constructor, is
the method `FoodCollection.digest()`, which conveniently does all these
operations in one call. This call is derived from an instance of class
`FoodQuery`.

## Class FoodQuery

Class `FoodQuery` is designed to parse, validate, and sanitize queries to be
passed to method `FoodCollection.digest()`. The goal is to instantiate a
`FoodCollection` first, and then *digest* (manipulate) it based on queries
passed as instances of `FoodQuery`. The collection is not mutated by default,
so you can go ahead and throw multiple queries.

# Integration

The package exports three classes / objects: `Food`, `FoodCollection` and
`FoodQuery`. You can import them this way.

```js
// You may need to change the path.
const { Food, FoodCollection, FoodQuery } = require('./lib/digest');
```

# Testing

Testing is based on the `mocha` framework. Run the command line below to
execute all unit tests.

```bash
npm run test
```

# Documentation

Code documentation is based on JSDoc 3. Run the command line below to generate
documentation files.

```bash
npm run doc
```

You can also check the source code of `index.js` directly.

# Bugs and feedback

Submit them [here](https://github.com/jeanmathieupotvin/digest/issues). Thanks!
