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

// Load test dataset.
const foodArr = require('./test-data');

// Construct a FoodCollection instance from test data.
const foodColl = new FoodCollection(foodArr);

/*!
 * =============================================================================
 * Class Food
 * =============================================================================
 */

describe('check Food class', function() {
    it('constructor returns a Food object', function() {
        assert.strictEqual(new Food(foodArr[0]) instanceof Food, true);
    });
    
    it('.validate() flags non-string properties', function() {
        const foodErr = Object.assign(foodArr[0]);
        foodErr.foodEn = false;
        assert.throws(() => new Food(foodErr));
    });

    it('.validate() flags non-standard food categories', function() {
        const foodErr = Object.assign(foodArr[0]);
        
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