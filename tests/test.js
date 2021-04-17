/*!
 * =============================================================================
 * digest - unit tests
 * =============================================================================
 * 
 * Copyright (c) 2021 Jean-Mathieu Potvin
 * MIT License
 */

"use strict";

// Dependencies.
const assert = require('assert').strict;
const { Food, FoodCollection, FoodQuery } = require('../');

/*!
 * =============================================================================
 * Test data used in multiple tests
 * =============================================================================
 */

// Load test dataset.
const foodArr = require('./test-data');

// Construct a FoodCollection instance from test data.
const foodColl = new FoodCollection(foodArr);

// Construct a test object to pass to FoodQuery constructor.
const foodQueryParams = {
    search: undefined,
    catJm: undefined,
    catRen: undefined,
    sort: undefined
};

/*!
 * =============================================================================
 * Class Food
 * =============================================================================
 */

describe('check Food class', function() {
    it('returns a Food object [constructor]', function() {
        assert.strictEqual(new Food(foodArr[0]) instanceof Food, true);
    });
    
    it('flags non-string properties [.validate()]', function() {
        // Deep copy first element of data.
        // Speed is not a concern here.
        const foodErr = JSON.parse(JSON.stringify(foodArr[0]));
        foodErr.foodEn = false;
        assert.throws(() => new Food(foodErr));
    });

    it('flags non-standard food categories [.validate()]', function() {
        // Deep copy first element of data.
        // Speed is not a concern here.
        const foodErr = JSON.parse(JSON.stringify(foodArr[0]));
        
        // Insert error into property catJm and test.
        foodErr.catJm = 'error';
        assert.throws(() => new Food(foodErr));

        // Remove error from catJm, insert
        // error into property catRen and test.
        foodErr.catJm  = foodErr.catRen;
        foodErr.catRen = 'error';
        assert.throws(() => new Food(foodErr));
    });
});

/*!
 * =============================================================================
 * Class FoodCollection
 * =============================================================================
 */

describe('check FoodCollection class', function() {
    it('returns a FoodCollection object [constructor]', function() {
        // Check if it works with a single array of objects.
        assert.strictEqual(new FoodCollection(foodArr) instanceof FoodCollection, true);

        // Check if further arguments are ignored when an array is passed.
        assert.strictEqual(new FoodCollection(foodArr, foodArr[0]) instanceof FoodCollection, true);
        
        // Multiple arguments.
        assert.strictEqual(new FoodCollection(foodArr[0], foodArr[1]) instanceof FoodCollection, true);
        
        // Multiple arguments; mix of Food instances and objects.
        assert.strictEqual(new FoodCollection(new Food(foodArr[0]), foodArr[1])  instanceof FoodCollection, true);
    });

    it('rejects arrays containing non-Food and non-coercible objects [.validate()]', function() {
        const nonFoodObj = { a: '1', b: '2' };
        assert.throws(() => new FoodCollection(foodArr[0], nonFoodObj));
    });

    it('rejects non-valid Food objects [.validate()]', function() {
        // Deep copy first element of data.
        // Speed is not a concern here.
        const foodErr = new Food(JSON.parse(JSON.stringify(foodArr[0])));
        foodErr.catJm = 'error';

        assert.throws(() => new FoodCollection(foodArr[0], foodErr));
    });

    it('filters collections by category [.filterByCat()]', function() {
        const subColl = new FoodCollection({
            alias: "green-tea",
            imgFile: "green-tea.jpg",
            foodEn: "Green Tea",
            foodFr: "Thé Vert",
            serving: "1 Tasse",
            catJm: "Superfood",
            catRen: "Minimize"
        });

        assert.deepEqual(foodColl.filterByCat('catJm', 'Superfood'), subColl);
        assert.deepEqual(foodColl.filterByCat('catRen', 'Minimize'), subColl);

        // Check arguments checks.
        assert.throws(() => foodColl.filterByCat('error'));
    });

    it('filters collections by keywords [.filterByKeyword()]', function() {
        const filteredColl = new FoodCollection(
            {
                alias: "grape-seed-oil",
                imgFile: "grape-seed-oil.jpg",
                foodEn: "Grape Seed Oil",
                foodFr: "Huile De Pépins De Raisin",
                serving: "1 Cuillère À Soupe",
                catJm: "Enjoy",
                catRen: "Enjoy"
            },
            {
                alias: "caraway-seed",
                imgFile: "caraway-seed.jpg",
                foodEn: "Caraway Seed",
                foodFr: "Graine De Cumin",
                serving: "1/4 Cuillère À Thé",
                catJm: "Enjoy",
                catRen: "Enjoy"
            }
        );

        assert.deepEqual(foodColl.filterByKeyword('gra'), filteredColl);
    });

    it('sorts collection appropriately in any order [.sortByProperty()]', function() {
        // Sorted collection by foodFr.
        const sortedFoodCollAsc = new FoodCollection(
            {
                alias: "caraway-seed",
                imgFile: "caraway-seed.jpg",
                foodEn: "Caraway Seed",
                foodFr: "Graine De Cumin",
                serving: "1/4 Cuillère À Thé",
                catJm: "Enjoy",
                catRen: "Enjoy"
            },
            {
                alias: "grape-seed-oil",
                imgFile: "grape-seed-oil.jpg",
                foodEn: "Grape Seed Oil",
                foodFr: "Huile De Pépins De Raisin",
                serving: "1 Cuillère À Soupe",
                catJm: "Enjoy",
                catRen: "Enjoy"
            },
            {
                alias: "barley",
                imgFile: "barley.jpg",
                foodEn: "Barley",
                foodFr: "Orge",
                serving: "3 Onces (Cuit)",
                catJm: "Minimize",
                catRen: "Enjoy"
            },
            {
                alias: "rutabaga",
                imgFile: "rutabaga.jpg",
                foodEn: "Rutabaga",
                foodFr: "Rutabaga (Navet)",
                serving: "1 Tasse (Tranché)",
                catJm: "Enjoy",
                catRen: "Enjoy"
            },
            {
                alias: "green-tea",
                imgFile: "green-tea.jpg",
                foodEn: "Green Tea",
                foodFr: "Thé Vert",
                serving: "1 Tasse",
                catJm: "Superfood",
                catRen: "Minimize"
            }
        );

        assert.deepEqual(foodColl.sortByProperty('foodFr', 'asc'), sortedFoodCollAsc);
        assert.deepEqual(foodColl.sortByProperty('foodFr', 'dsc'), sortedFoodCollAsc.reverse());
        
        // Check argument checks.
        assert.throws(() => foodColl.sortByProperty('foodFr', 'error'));
    });

    it('digests the collection approprately [.digest()]', function() {
        const subColl = new FoodCollection(
            {
                alias: "caraway-seed",
                imgFile: "caraway-seed.jpg",
                foodEn: "Caraway Seed",
                foodFr: "Graine De Cumin",
                serving: "1/4 Cuillère À Thé",
                catJm: "Enjoy",
                catRen: "Enjoy"
            },
            {
                alias: "grape-seed-oil",
                imgFile: "grape-seed-oil.jpg",
                foodEn: "Grape Seed Oil",
                foodFr: "Huile De Pépins De Raisin",
                serving: "1 Cuillère À Soupe",
                catJm: "Enjoy",
                catRen: "Enjoy"
            }
        );

        const foodQuery = new FoodQuery({
            search: 'gra',
            catJm: 'Enjoy',
            catRen: "Enjoy'",
            sort: 'foodEn'
        });

        assert.deepEqual(foodColl.digest(foodQuery), subColl);
    });

    it('returns the collection when arguments passed to methods are null', function() {
        const nullFoodQuery = new FoodQuery({
            search: null,
            catJm: null,
            catRen: null,
            sort: null
        });

        assert.deepEqual(foodColl.filterByCat('catJm'), foodColl);
        assert.deepEqual(foodColl.filterByKeyword(), foodColl);
        assert.deepEqual(foodColl.sortByProperty(), foodColl);
        assert.deepEqual(foodColl.digest(nullFoodQuery), foodColl);
    });
});

/*!
 * =============================================================================
 * Class FoodQuery
 * =============================================================================
 */

describe('check FoodQuery class', function() {
    it('returns a FoodQuery object [constructor]', function() {
        assert.strictEqual(new FoodQuery(foodQueryParams) instanceof FoodQuery, true);
    });

    it('validates and sanitizes search keywords appropriately [.validateParamSearch()]', function() {
        // Create instance.
        const foodQuery = new FoodQuery(foodQueryParams);

        // Test that a null is returned on falsy values.
        assert.strictEqual(foodQuery.validateParamSearch(), null);

        // Test that usual keywords work.
        foodQuery.validateParamSearch('éàê', 'éàê');
        foodQuery.validateParamSearch('bar', 'bar');
        foodQuery.validateParamSearch('foo', 'foo');

        // Test that usual characters and digits
        // are removed in non-falsy values.
        assert.strictEqual(
            foodQuery.validateParamSearch('\'!\"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~0123456789]'),
            ''
        );
    });

    it('validates categories parameters [.validateParamCat()]', function() {
        // Create instance.
        const foodQuery = new FoodQuery(foodQueryParams);
        
        // Test standard values.
        assert.strictEqual(foodQuery.validateParamCat('Superfood'), 'Superfood');
        assert.strictEqual(foodQuery.validateParamCat('Enjoy'),     'Enjoy');
        assert.strictEqual(foodQuery.validateParamCat('Minimize'),  'Minimize');
        assert.strictEqual(foodQuery.validateParamCat('Avoid'),     'Avoid');

        // Test if null is returned when non-standard
        // parameters are passed to validator.
        assert.strictEqual(foodQuery.validateParamCat('error'), null);
    });

    it('validates sort parameters [.validateParamSort()]', function() {
        // Create instance.
        const foodQuery = new FoodQuery(foodQueryParams);
        
        // Test standard values.
        assert.strictEqual(foodQuery.validateParamSort('foodEn'), 'foodEn');
        assert.strictEqual(foodQuery.validateParamSort('foodFr'), 'foodFr');
        assert.strictEqual(foodQuery.validateParamSort('catJm'),  'catJm');
        assert.strictEqual(foodQuery.validateParamSort('catRen'), 'catRen');

        // Test if null is returned when non-standard
        // parameters are passed to validator.
        assert.strictEqual(foodQuery.validateParamSort('error'), null);
    });
});
