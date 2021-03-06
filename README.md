# digest

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

Package `digest` is a small framework designed to easily manipulate results
stemming from [Viome](https://www.viome.com/) Gut Intelligence Test® kits. It lets
you construct collections of `Food` objects and efficiently search, filter and
sort them. It has built-in data parsers and validators, and can sanitize
queries passed to the collection. It is purposely kept minimal, and focuses on
speed.

# Installation

The package is not published on `npm`. I thought it was too specific to be
published. Instead, users can declare it as a submodule to their project.

```bash
git submodule add https://github.com/jeanmathieupotvin/digest lib/digest
git add .gitmodules
git add lib/digest
git commit -m "Add digest as a dependency to project."
```

To use a specific version of the submodule, checkout a specific
version tag or commit. Navigate to `lib/digest`, checkout the
required version and stage/commit the submobule.

To update the submodule, follow these steps.

```bash
cd lib/digest
git pull origin main
git checkout [TAG|HASH] # if you require a specific version
cd ../..
git add lib/digest
git commit -m "Update package digest to version X.Y.Z."
```

Alternatively, users can clone this repository into their project.

```bash
cd lib
git clone https://github.com/jeanmathieupotvin/digest
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
exports all classes of `digest`: `Food`, `FoodCollection` and
`FoodQuery`. The two arguments passed to `setup()` customize the `Food`
class, and adpats it to your own data, by ensuring generic properties
`catPerson1` and `catPerson2` are renamed to `'cat' + keyPerson1`. Be careful
to pass the exact same person keys you used when constructing your data. See
section [Usage](#Usage) below.

# Usage

Package `digest` relies on a central data structure called `Food`. Here
is an example of one valid `Food` object.

```js
// In the following example, person keys would be 'Romeo' and 'Juliet'.
{
    "alias": "green-tea",
    "imgFile": "green-tea.jpg",
    "foodEn": "Green Tea",
    "foodNative": "Thé Vert",
    "serving": "1 Cup",
    "catRomeo": "Superfood",
    "catJuliet": "Minimize"
}
```

This structure is designed to hold information on one food included in Viome® 
results. It also holds information on categories of two persons, here Romeo
and Juliet.

Refer to the official documentation for detailed information.

## Building datasets of multiple Foods

Package `digest` assumes you already have an array of objects having this
structure. It cannot assist you in this (boring) task, because this could
potentially violate Viome® terms and conditions.

## Class Food 

The data structure above is formalized by class `Food`.

Full documentation is available [here](https://docs.potvin.xyz/digest/v1.1/Food.html).

## Class FoodCollection

`Food` instances are grouped together through class `FoodCollection`. The latter 
extends class `Array` and provides additional methods to easily search, filter and
sort the collection. The main interface to the collection, aside from the constructor,
is the method `FoodCollection.digest()`, which conveniently does all these
operations in one call. This call is derived from an instance of class
`FoodQuery`.

Full documentation is available [here](https://docs.potvin.xyz/digest/v1.1/FoodCollection.html).

## Class FoodQuery

Class `FoodQuery` is designed to parse, validate, and sanitize queries to be
passed to method `FoodCollection.digest()`. The goal is to instantiate a
`FoodCollection` first, and then *digest* (manipulate) it based on queries
passed as instances of `FoodQuery`. The collection is not mutated by default,
so you can go ahead and throw multiple queries.

Full documentation is available [here](https://docs.potvin.xyz/digest/v1.1/FoodQuery.html).

# Testing

Testing is based on the `mocha` framework. Run the command line below to
execute all unit tests.

```bash
npm run test
```

# Documentation

Code documentation is based on JSDoc 3. It is fully available
[here](https://docs.potvin.xyz/digest/v1.1). You can also run the command line
below to generate all documentation files.

```bash
npm run doc
```

# Bugs and feedback

Submit them [here](https://github.com/jeanmathieupotvin/digest/issues). Thanks!
