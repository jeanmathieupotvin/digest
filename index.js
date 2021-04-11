/*!
 * =============================================================================
 * digest
 * =============================================================================
 * 
 * Copyright (c) 2021 Jean-Mathieu Potvin
 * MIT License
 */

"use strict";

/**
 * Global constants.
 * @param {string[]} stdCats - Standardized Viome® categories for foods.
 * @param {string[]} sortableProps - Properties that can be used to sort
 *     a FoodCollection.
 */
 const globals = {
    stdCats: [
        'Superfood', 
        'Enjoy', 
        'Minimize', 
        'Avoid'
    ],
    sortableProps: [
        "foodEn", 
        "foodFr", 
        "catJm", 
        "catRen"
    ]
}

/**
 * Class Food represents a food included in the results of a Viome Gut
 * Intelligence Test® kits.
 */
class Food {
    /**
     * Construct a Food object.
     * @param {string} alias - A unique ID.
     * @param {string} imgFile - A file name of an image of the food.
     * @param {string} foodEn - Name in English.
     * @param {string} foodFr - Name in French.
     * @param {string} serving - Serving recommended by Viome® when the food
     *     should be either mnimized or avoided.
     * @param {string} catJm - Standardized Viome® category for Jean-Mathieu.
     *     Categories varies by person.
     * @param {string} catRen - Standardized Viome® category for Renée.
     *     Categories varies by person.
     * @returns {Food} A Food instance.
     */
    constructor({ alias, imgFile, foodEn, foodFr, serving, catJm, catRen }) {
        // Construct candidate instance.
        this.alias   = alias;
        this.imgFile = imgFile;
        this.foodEn  = foodEn;
        this.foodFr  = foodFr;
        this.serving = serving;
        this.catJm   = catJm;
        this.catRen  = catRen;

        // Validate instance before returning.
        this.validate();
    }

    /**
     * Validate a Food object.
     * @returns {Food} - The underlying object is returned if it is valid.
     *     Else, an error is returned. An object is considered valid if
     *         (1) all its properties are strings and
     *         (2) properties catJm and catRen contain standardized strings.
     *     See globals.stdCats for more information.
     */
    validate() {
        // Validate that all parameters are non-empty strings.
        Object.keys(this).forEach(e => {
            if (typeof this[e] !== 'string' || this[e].length === 0) {
                throw new TypeError(`property ${e} must be a string (food alias: ${this.alias}).`);
            }
        })

        // Validate that categories are standard strings.
        if (globals.stdCats.indexOf(this.catJm) < 0) {
            throw new Error(`${this.catJm} is not a standard food category (food alias: ${this.alias}).`);
        }
        if (globals.stdCats.indexOf(this.catRen) < 0) {
            throw new Error(`${this.catRen} is not a standard food category (food alias: ${this.alias}).`);
        }
        
        // Return object if valid.
        return this;
    }
}

/**
 * Class FoodCollection represents an array of Food objects. It extends
 * class Array.
 */
class FoodCollection extends Array {
    /**
     * Construct a FoodCollection object.
     * @param {object[]|Food[]|...object|...Food} items - Either an array of
     *     Food instances and/or coercible objects, or any number of these
     *     objects. You can mix Food instances with regular objects, these
     *     will be converted to Food objects. If the first argument passed
     *     to ...items is an array, then the elements of that array are used,
     *     and any other argument passed to ...items is ignored.
     * @returns {FoodCollection} A FoodCollection instance.
     */
    constructor(...items) {
        // Construct candidate collection.
        if (items[0] instanceof Array) {
            super(...items[0]);
        } else {
            super(...items);
        }
        
        // Validate items in collection before returning.
        this.validate();
    }

    /**
     * Validate the elements of a FoodCollection. Attempt to coerce objects
     * to Food instances, if any.
     * @returns {FoodCollection} - The underlying object is returned if it is
     *     valid. Else, an error is returned. An object is considered valid if
     *     all its elements are Food instances (or can be coerced to Food
     *     instances).
     */
    validate() {
        // Loop over the elements of the collection.
        this.forEach((e, i) => {
            if (e instanceof Food) {
                // If the element is a Food instance, validate it.
                e.validate();
            } else if (typeof e === "object") {
                // Else, if it is an object, attempt to 
                // coerce it to instance of class Food.
                this[i] = new Food(e);
            } else {
                // Else, return an error.
                throw new TypeError('Items passed to FoodCollection() can only be Food instances and/or objects that can be coerced to class Food.');
            }
        });

        // Return object if valid.
        return this;
    }

    /**
     * Filter a FoodCollection by category.
     * @param {string} foodProp - A Food property holding Viome® standard food
     *     categories: either catJm or catRen.
     * @param {string|null} queryParam - A value stemming from properties catJm
     *     or catRen of a FoodQuery object. This argument should come from a
     *     FoodQuery instance.
     * @returns {FoodCollection} - The filtered FoodCollection. If queryParam
     *     is null, the whole collection is returned.
     */
    filterByCat(foodProp, queryParam = null) {
        // Check foodProp argument. We do so even if 
        // queryParam is null, because a wrong call
        // to the method should not be permitted.
        // It must raise an error.
        if (foodProp !== "catJm" && foodProp !== "catRen") {
            throw new Error("foodProp should be equal to 'catJm' or 'catRen'.");
        }
        
        // If null, return this collection.
        // Else, returned the filtered collection.
        return (queryParam !== null)
            ? this.filter(e => e[foodProp] === queryParam)
            : this;
    }

    /**
     * Filter a FoodCollection by names.
     * @param {string|null} queryParam - A (sanitized) search keyword. It is
     *     used to filter both English and French food names (Food properties
     *     foodEn and foodFr). This argument should come from a FoodQuery
     *     instance.
     * @returns {FoodCollection} - The filtered FoodCollection. If queryParam
     *     is null, the whole collection is returned.
     */
    filterByKeyword(queryParam = null) {
        // Check if a search must be performed.
        if (queryParam !== null) {
            // Construct a regular expression from search keyword.
            // It is already sanitized, so this is safe.
            const searchRegEx = new RegExp(queryParam, "i");

            // Search for matches in properties foodEn and
            // foodFr of the Food instances in the collection.
            // Return the filtered collection.
            return this.filter(e => {
                return e.foodEn.match(searchRegEx) !== null || 
                    e.foodFr.match(searchRegEx) !== null;
            });
        } else {
            // Else, return this collection.
            return this;
        }
    }

    /**
     * Sort a FoodCollection by a sortable Food property.
     * @param {string|null} queryParam - A Food property to use when sorting
     *     the collection. See globals.sortableProps for more information. This
     *     argument should come from a FoodQuery instance.
     * @param {string} order - Either 'asc' for ascending (alphabetical) order
     *     or 'dsc' for descending (reversed alphabetical) order. 
     * @returns 
     */
    sortByProperty(queryParam = null, order = "asc") {
        // Check order argument. We do so even if 
        // queryParam is null, because a wrong call
        // to the method should not be permitted.
        // It must raise an error.
        if (order !== "asc" && order !== "dsc") {
            throw new Error("order parameter must be 'asc' or 'dsc'.");
        }

        // Define a sorting callback function.
        // Here, we use the fast Intl.Collator()
        // as the comparator engine, because we
        // deal with French accents.
        const sortCb = (a, b) => {
            return new Intl.Collator().compare(a[queryParam], b[queryParam]);
        }

        // If null, return this collection.
        // Else, returned the sorted collection.
        return (queryParam !== null) 
            ? (order === 'asc') ? this.sort(sortCb) : this.sort(sortCb).reverse()
            : this;
    }

    /**
     * Digest (filter and sort) a FoodCollection.
     * @param {FoodQuery} query - An instance of class FoodQuery holding the
     *     parameters of a user's query. 
     * @returns {FoodCollection} - The digested FoodCollection (filtered
     *     and sorted). If queryParam is null, the whole collection is returned.
     */
    digest(query) {
        // Destructure FoodQuery instance.
        const { search, catJm, catRen, sort } = query;

        // Returned digested array (possibly empty).
        // Filter by categories first (it is faster).
        // Then, filter by keyword and finally, sort results.
        return this
            .filterByCat('catJm', catJm)
            .filterByCat('catRen', catRen)
            .filterByKeyword(search)
            .sortByProperty(sort, 'asc');
    }
}

/**
 * Class FoodQuery represents a query sent by a user to filter and sort a
 * FoodCollection based on optional parameters.
 */
class FoodQuery {
    /**
     * Construct a FoodQuery object.
     * @param {string|undefined} search - An optional keyword / string to use to
     *     filter a FoodCollection based on foodEn and foodFr properties of
     *     Food instances.
     * @param {string|undefined} catJm - An optional standard food category to
     *     use to filter a FoodCollection based on property catJm of
     *     Food instances.
     * @param {string|undefined} catRen - An optional standard food category to
     *     use to filter a FoodCollection based on property catRen of
     *     Food instances.
     * @param {string|undefined} sort - An optional property of a Food instance
     *     to use when sorting a FoodCollection.
     * @returns {FoodQuery} A FoodQuery instance.
     */
    constructor({ search, catJm, catRen, sort }) {
        // Set and validate inputs of query.
        // Validation is self-healing. Whenever a
        // bad parameter is detected, a null value
        // is returned. A null value means the 
        // property won't be used when the Query
        // is later digested by FoodCollection.digest(). 
        this.search = this.validateParamSearch(search);
        this.catJm  = this.validateParamCat(catJm);
        this.catRen = this.validateParamCat(catRen);
        this.sort   = this.validateParamSort(sort);
    }

    /**
     * Validate a search parameter.
     * @param {string|undefined} param - A search keyword. Refer to parameter 
     *     search of the constructor for more information.
     * @returns {string|null} - A sanitized version of param. All punctuation
     *     characters and digits are removed; only letters and spaces are kept.
     *     If param is undefined, a null value is returned.
     */
    validateParamSearch(param) {
        if (param) {
            // Create a regular expression that captures all
            // punctuation groups from Unicode, all ASCII
            // punctuation characters and all digits.
            const filterRegEx = new RegExp(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~0123456789]/, 'g');

            // Returned sanitized value.
            return param.replace(filterRegEx, '');
        } else {
            return null;
        }
    }

    /**
     * Validate a *cat parameter (catJm or catRen).
     * @param {string|undefined} param - A standard food category. Refer to
     *     parameters catJm or catRen of the constructor for more information.
     * @returns {string|null} - The param argument is returned if it matches
     *    (exactly) a standard value. Else, a null value is returned.
     */
    validateParamCat(param) {
        return (globals.stdCats.indexOf(param) > -1) ? param : null;
    }

    /**
     * Validate a sort parameter.
     * @param {string|undefined} param - A property of a Food instance. Refer
     *     to parameter sort of the constructor for more information.
     * @returns {string|null} - The param argument is returned if it matches
     *    a sortable property of the Food class. Else, a null value is returned.
     */
    validateParamSort(param) {
        return (globals.sortableProps.indexOf(param) > -1) ? param : null;
    }
}

/**
 * Module exports.
 * Users who would like to use this library can easily replace properties
 * 'catJm' and 'catRen' by their own customized property names in their
 * dataset and in this script. 
 * @public
 */

module.exports = { Food, FoodCollection, FoodQuery };
