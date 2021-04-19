# digest

[![test](https://github.com/jeanmathieupotvin/digest/actions/workflows/npm-test.yml/badge.svg?branch=main)](https://github.com/jeanmathieupotvin/digest/actions/workflows/npm-test.yml)

A digestive for data structures constructed from results stemming from
[Viome](https://www.viome.com/) Gut Intelligence Test® kits.

# Disclaimer

I am not affiliated to Viome® in any way. Package `digest` is an independent
project. 

No Viome® data is exposed by `digest`. It assumes that each user builds its own
dataset manually from their personal results. On a side-note, the small test
dataset was built manually from my personal results.

*Viome*® and *Viome Gut Intelligence Test*® are registered trademarks. Buy your
own kit online from their [online store](https://www.viome.com/products/gut-intelligence).

# Description

Package `digest` is a small framework designed to more easily manipulate results
stemming from [Viome](https://www.viome.com/) Gut Intelligence Test® kits. It lets
you construct collections of `Food` objects and efficiently search, filter and
sort them. It has built-in data parsers and validators, and can sanitize
queries passed to the collection.

# Installation

The package is not published on `npm`. I thought it was too specific to be
published. Instead, users can declare it as a submodule to their project.

```bash
git submodule add https://github.com/jeanmathieupotvin/digest ./lib/digest
git add .gitmodules
git add ./lib/digest
git commit -m "Adding digest as a dependency to project."
git checkout [VERSION-TAG]
```

Alternatively, users can clone this repository into their project.

```bash
cd lib
git clone https://github.com/jeanmathieupotvin/digest
git checkout [VERSION-TAG]
```

Finally, they can manually download an
[official release](https://github.com/jeanmathieupotvin/digest/releases) from
this repository.

# Setup

The package exposes a single function that you can import as a regular
CommonJS module.

```js
const digest = require('./lib/digest')('keyPerson1', 'keyPerson2');
```

Code above imports the `setup()` function and immediately invokes it. This
itself exports all classes of `digest`: `Food`, `FoodCollection` and
`FoodQuery`. The two arguments passed to `setup()` customize the `Food`
class, and adpats it to your own data, by ensuring generic properties
`catPerson1` and `catPerson2` are renamed to `'cat' + keyPerson1`. This
means you must be careful to pass the exact same person keys you used when
constructing your data. See section [Usage](#Usage) for more information.

# Usage

Package `digest` relies on a central data structure called `Food`. Here
is an example of one valid `Food` object.

```js
{
    "alias": "green-tea",
    "imgFile": "green-tea.jpg",
    "foodEn": "Green Tea",
    "foodNative": "Thé Vert",
    "serving": "1 Tasse",
    "catRomeo": "Superfood",
    "catJuliet": "Minimize"
}
```

This structure is designed to hold information on one food included in Viome® 
results. It also holds information on categories of two persons, here Romeo
and Juliet. Refer to the official documentation for more information.

## Building datasets of multiple Foods

Package `digest` assumes you already have an array of objects having this
structure. It cannot assist you in this (boring) task, because this could
potentially violate Viome® terms and conditions.

## Class Food 

Here.

## Class FoodCollection

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
