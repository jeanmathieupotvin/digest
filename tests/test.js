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
const assert = require("assert").strict;
const digest = require("../");

// Load test dataset.
const foodArr = require('test-data.json');

// Construct a FoodCollection instance from test data.
const foodCollection = new digest.FoodCollection(foodArr);

// TBD.