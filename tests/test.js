/*!
 * =============================================================================
 * digest - unit tests
 * =============================================================================
 * 
 * Copyright (c) 2021 Jean-Mathieu Potvin
 * MIT License
 */

'use strict';

// Dependencies.
const assert = require('assert').strict;

/*!
 * =============================================================================
 * Test data
 * =============================================================================
 */

/*!
 * Load test dataset.
 * Test dataset consists of 5 foods taken from the combined results of Romeo
 * and Juliet.
 */
const foodArr = require('./test-data');

// Expose classes of digest.
const { Food, FoodCollection, FoodQuery } = require('../')('Romeo', 'Juliet');

/*!
 * =============================================================================
 * Objects reused in multiple tests
 * =============================================================================
 */

// Construct a FoodCollection instance from test data.
const foodColl = new FoodCollection(foodArr);

// Construct a test object to pass to FoodQuery constructor.
const foodQueryParams = {
    search: undefined,
    catRomeo: undefined,
    catJuliet: undefined,
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
        
        // Insert error into property catRomeo and test.
        foodErr.catRomeo = 'error';
        assert.throws(() => new Food(foodErr));

        // Remove error from catRomeo, insert
        // error into property catJuliet and test.
        foodErr.catRomeo  = foodErr.catJuliet;
        foodErr.catJuliet = 'error';
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
        foodErr.catRomeo = 'error';

        assert.throws(() => new FoodCollection(foodArr[0], foodErr));
    });

    it('filters collections by category [.filterByCat()]', function() {
        const subColl = new FoodCollection({
            alias: 'green-tea',
            imgFile: 'green-tea.jpg',
            foodEn: 'Green Tea',
            foodNative: 'Thé Vert',
            serving: '1 Tasse',
            catRomeo: 'Superfood',
            catJuliet: 'Minimize'
        });

        assert.deepEqual(foodColl.filterByCat('catRomeo', 'Superfood'), subColl);
        assert.deepEqual(foodColl.filterByCat('catJuliet', 'Minimize'), subColl);

        // Check arguments checks.
        assert.throws(() => foodColl.filterByCat('error'));
    });

    it('filters collections by keywords [.filterByKeyword()]', function() {
        const filteredColl = new FoodCollection(
            {
                alias: 'grape-seed-oil',
                imgFile: 'grape-seed-oil.jpg',
                foodEn: 'Grape Seed Oil',
                foodNative: 'Huile De Pépins De Raisin',
                serving: '1 Cuillère À Soupe',
                catRomeo: 'Enjoy',
                catJuliet: 'Enjoy'
            },
            {
                alias: 'caraway-seed',
                imgFile: 'caraway-seed.jpg',
                foodEn: 'Caraway Seed',
                foodNative: 'Graine De Cumin',
                serving: '1/4 Cuillère À Thé',
                catRomeo: 'Enjoy',
                catJuliet: 'Enjoy'
            }
        );

        assert.deepEqual(foodColl.filterByKeyword('gra'), filteredColl);
    });

    it('sorts collection appropriately in any order [.sortByProperty()]', function() {
        // Sorted collection by foodNative.
        const sortedFoodCollAsc = new FoodCollection(
            {
                alias: 'caraway-seed',
                imgFile: 'caraway-seed.jpg',
                foodEn: 'Caraway Seed',
                foodNative: 'Graine De Cumin',
                serving: '1/4 Cuillère À Thé',
                catRomeo: 'Enjoy',
                catJuliet: 'Enjoy'
            },
            {
                alias: 'grape-seed-oil',
                imgFile: 'grape-seed-oil.jpg',
                foodEn: 'Grape Seed Oil',
                foodNative: 'Huile De Pépins De Raisin',
                serving: '1 Cuillère À Soupe',
                catRomeo: 'Enjoy',
                catJuliet: 'Enjoy'
            },
            {
                alias: 'barley',
                imgFile: 'barley.jpg',
                foodEn: 'Barley',
                foodNative: 'Orge',
                serving: '3 Onces (Cuit)',
                catRomeo: 'Minimize',
                catJuliet: 'Enjoy'
            },
            {
                alias: 'rutabaga',
                imgFile: 'rutabaga.jpg',
                foodEn: 'Rutabaga',
                foodNative: 'Rutabaga (Navet)',
                serving: '1 Tasse (Tranché)',
                catRomeo: 'Enjoy',
                catJuliet: 'Enjoy'
            },
            {
                alias: 'green-tea',
                imgFile: 'green-tea.jpg',
                foodEn: 'Green Tea',
                foodNative: 'Thé Vert',
                serving: '1 Tasse',
                catRomeo: 'Superfood',
                catJuliet: 'Minimize'
            }
        );

        assert.deepEqual(foodColl.sortByProperty('foodNative', 'asc'), sortedFoodCollAsc);
        assert.deepEqual(foodColl.sortByProperty('foodNative', 'dsc'), sortedFoodCollAsc.reverse());
        
        // Check argument checks.
        assert.throws(() => foodColl.sortByProperty('foodNative', 'error'));
    });

    it('digests the collection approprately [.digest()]', function() {
        const subColl = new FoodCollection(
            {
                alias: 'caraway-seed',
                imgFile: 'caraway-seed.jpg',
                foodEn: 'Caraway Seed',
                foodNative: 'Graine De Cumin',
                serving: '1/4 Cuillère À Thé',
                catRomeo: 'Enjoy',
                catJuliet: 'Enjoy'
            },
            {
                alias: 'grape-seed-oil',
                imgFile: 'grape-seed-oil.jpg',
                foodEn: 'Grape Seed Oil',
                foodNative: 'Huile De Pépins De Raisin',
                serving: '1 Cuillère À Soupe',
                catRomeo: 'Enjoy',
                catJuliet: 'Enjoy'
            }
        );

        const foodQuery = new FoodQuery({
            search: 'gra',
            catRomeo: 'Enjoy',
            catJuliet: 'Enjoy',
            sort: 'foodEn'
        });

        assert.deepEqual(foodColl.digest(foodQuery), subColl);
    });

    it('returns the collection when arguments passed to methods are null', function() {
        const nullFoodQuery = new FoodQuery({
            search: null,
            catRomeo: null,
            catJuliet: null,
            sort: null
        });

        assert.deepEqual(foodColl.filterByCat('catRomeo'), foodColl);
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
            foodQuery.validateParamSearch('\'!\'#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~0123456789]'),
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
        assert.strictEqual(foodQuery.validateParamSort('foodNative'), 'foodNative');
        assert.strictEqual(foodQuery.validateParamSort('catRomeo'),  'catRomeo');
        assert.strictEqual(foodQuery.validateParamSort('catJuliet'), 'catJuliet');

        // Test if null is returned when non-standard
        // parameters are passed to validator.
        assert.strictEqual(foodQuery.validateParamSort('error'), null);
    });
});
