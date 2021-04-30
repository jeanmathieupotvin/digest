/*!
 * =============================================================================
 * digest
 * =============================================================================
 * 
 * Copyright (c) 2021 Jean-Mathieu Potvin
 * MIT License
 */

'use strict';

/**
 * Module exports.
 * @public
 */

 module.exports = setup;

/**
 * Customize and expose public classes of digest.
 * @param {string} keyPerson1 - Key for person 1. It must match
 *     key used in the underlying data. Example: if a Food structure
 *     uses property `catRomeo`, then `keyPerson1` must be `Romeo`.
 * @param {string} keyPerson2 - Key for person 2. It must match
 *     key used in the underlying data. Example: if a Food structure
 *     uses property `catJuliet`, then `keyPerson2` must be `Juliet`. 
 * @returns {object} An object exposing classes of digest: Food, FoodCollection
 *     and FoodQuery.
 */
function setup(keyPerson1, keyPerson2) {

    /**
     * Mapping between back-end generic keys and user-defined keys
     * for properties holding food categories in Food objects. In
     * the source code, these keys are referred to as catPerson1
     * and catPerson2.
     * @private
     */
    const catPerson1 = `cat${keyPerson1}`;
    const catPerson2 = `cat${keyPerson2}`;

    /**
     * Standard Viome® food categories.
     * @private
     */
    const stdCats = [
        'Superfood', 
        'Enjoy', 
        'Minimize', 
        'Avoid'
    ];
        
    /**
     * Sortable properties / keys.
     * @private
     */
    const sortableKeys = [
        'alias',
        'foodEn', 
        'foodNative'
    ];
    sortableKeys.push(catPerson1, catPerson2);
    
    /**
     * Class Food represents a food included in the results of a Viome Gut
     * Intelligence Test® kits.
     * @public
     */
    class Food {
        /**
         * Construct a Food object.
         * @param {object} food
         * @param {string} food.alias        - Unique ID.
         * @param {string} [food.imgFile]    - File name of an image of the food.
         *     If unused, it is set equal to an empty string.
         * @param {string} food.foodEn       - Name in english.
         * @param {string} [food.foodNative] - Name in native langugage. If
         *     unused, it is set equal to `foodEn`.
         * @param {string} food.serving      - Serving recommended by Viome®
         *     when the food should be either minimized or avoided. It should
         *     be based on native language.
         * @param {...string} food.cats      - Standardized Viome® category for
         *     Person 1 and Person 2 respectively: `Superfood`, `Enjoy`,
         *     `Minimize` or `Enjoy`. Categories varies by person. Further
         *     arguments are ignored by the constructor.
         * @returns {Food} A Food instance.
         */
        constructor({ alias, imgFile = '', foodEn, foodNative = foodEn, serving, ...cats }) {
            // Set common properties.
            this.alias      = alias;
            this.imgFile    = imgFile;
            this.foodEn     = foodEn;
            this.foodNative = foodNative;
            this.serving    = serving;
            
            // Set properties named after keys in keysMap
            // equal to underlying object properties.
            this[catPerson1] = cats[catPerson1];
            this[catPerson2] = cats[catPerson2];

            // Validate instance before returning.
            this.validate();
        }

        /**
         * Validate a Food object.
         * @returns {Food} The underlying object is returned if valid.
         *     Else, an error is returned. An object is considered valid if
         *     (1) all its properties are strings and (2) properties
         *     `catPerson1` and `catPerson2` contain standard strings: 
         *     only `Superfood`, `Enjoy`, `Minimize`, `Avoid`.
         */
        validate() {
            // Validate keys.
            if (this[catPerson1] === undefined ||
                this[catPerson2] === undefined) {
                    throw new Error(`person keys do not match (food alias: ${this.alias}).`);
            }

            // Validate that all parameters are strings.
            if (Object.keys(this).some(e => typeof this[e] !== 'string')) {
                throw new TypeError(`all properties must be a string (food alias: ${this.alias}).`);
            }

            // Validate that categories contain standard strings.
            if (stdCats.indexOf(this[catPerson1]) < 0) {
                throw new Error(`${this[catKeys[0]]} is not a standard food category (food alias: ${this.alias}).`);
            }
            if (stdCats.indexOf(this[catPerson2]) < 0) {
                throw new Error(`${this[catKeys[1]]} is not a standard food category (food alias: ${this.alias}).`);
            }
            
            // Return object if valid.
            return this;
        }
    }

    /**
     * Class FoodCollection represents an array of Food objects. It extends
     * class Array.
     * @public
     */
    class FoodCollection extends Array {
        /**
         * Construct a FoodCollection object.
         * @param {object[]|Food[]|...Food|...object} items - Either an array of
         *     Food instances and/or coercible objects, or any number of these
         *     objects. You can mix Food instances with regular objects, these
         *     will be converted to Food objects. If the first argument passed
         *     to ...items is an array, then the elements of that array are
         *     used, and any other argument passed to ...items is ignored.
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
         * @returns {FoodCollection} The underlying object is returned if it is
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
                } else if (typeof e === 'object') {
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
         * Filter a FoodCollection by categories of one person.
         * @param {string} catKey   - Food's property name. Either
         *     `catPerson1` or `catPerson2`.
         * @param {string|null} arg - Standard Viome® food category:
         *     `Superfood`, `Enjoy`, `Minimize` or `Avoid`. Beware!
         *     This argument should come from a FoodQuery instance,
         *     as it is not validated.
         * @returns {FoodCollection} The filtered FoodCollection. If `arg` is
         *     null, the whole collection is returned.
         */
        filterByCat(catKey, arg = null) {
            // Check foodProp argument. We do so even if arg
            // is null, because a wrong call to the method
            // should not be permitted. It must  raise an error.
            if (catKey !== catPerson1 && catKey !== catPerson2) {
                throw new Error(`foodProp should be equal to ${catPerson1} or ${catPerson2}.`);
            }
            
            // If null, return this collection.
            // Else, returned the filtered collection.
            return (arg !== null)
                ? this.filter(e => e[catKey] === arg)
                : this;
        }

        /**
         * Filter a FoodCollection by english or native names.
         * @param {string|null} arg - Pre-sanitized search keyword. It is used
         *     to filter both english and native food names. This argument
         *     should come from a FoodQuery instance, as no sanitization is
         *     performed.
         * @returns {FoodCollection} The filtered FoodCollection. If arg
         *     is null, the whole collection is returned.
         */
        filterByKeyword(arg = null) {
            // Check if a search must be performed.
            if (arg !== null) {
                // Construct a regular expression from keyword.
                // It is already sanitized, so this is safe.
                const searchRegEx = new RegExp(arg, 'i');

                // Search for matches in properties foodEn and
                // foodNative of Food instances in the collection
                // and return it.
                return this.filter(e => {
                    return e.foodEn.match(searchRegEx) !== null || 
                           e.foodNative.match(searchRegEx) !== null;
                });
            } else {
                // Else, return this collection.
                return this;
            }
        }

        /**
         * Sort a FoodCollection by a *sortable* Food property.
         * @param {string|null} arg - A Food property used to sort
         *     the collection: `alias`, `foodEn`, `foodNative`, `catPerson1`
         *     or `catPerson2`. This argument should come from a FoodQuery
         *     instance, as it is not validated.
         * @param {string} order - Either `asc` for ascending (alphabetical)
         *     order or `dsc` for descending (reversed alphabetical) order. 
         * @returns {FoodCollection} The sorted FoodCollection. If `arg`
         *     is null, the collection is returned as is.
         */
        sortByProperty(arg = null, order = 'asc') {
            // Check order argument. We do so even if 
            // arg is null, because a wrong call
            // to the method should not be permitted.
            // It must raise an error.
            if (order !== 'asc' && order !== 'dsc') {
                throw new Error("order parameter must be 'asc' or 'dsc'.");
            }

            // Define a sorting callback function.
            // Here, we use the fast Intl.Collator()
            // as the comparator engine, because we
            // deal with French accents.
            const sortCb = (a, b) => {
                return new Intl.Collator().compare(a[arg], b[arg]);
            }

            // If null, return this collection.
            // Else, returned the sorted collection.
            return (arg !== null) 
                ? (order === 'asc') 
                    ? this.sort(sortCb)
                    : this.sort(sortCb).reverse()
                : this;
        }

        /**
         * Digest (filter and sort) a FoodCollection.
         * @param {FoodQuery} query - An instance of class FoodQuery holding
         *     the parameters of a user's query. 
         * @returns {FoodCollection} The digested FoodCollection (filtered
         *     and sorted). If query is null, the collection is returned as is.
         */
        digest(query) {
            // Check argument first. We require an instance of query.
            if (!query instanceof FoodQuery) {
                throw new TypeError('argument is not an instance of class FoodQuery.');
            }

            // Returned digested array (possibly empty).
            // Filter by categories first (it is faster).
            // Then, filter by keyword and finally, sort results.
            return this
                .filterByCat(catPerson1, query[catPerson1])
                .filterByCat(catPerson2, query[catPerson2])
                .filterByKeyword(query.search)
                .sortByProperty(query.sort, 'asc');
        }
    }

    /**
     * Class FoodQuery represents a query passed by a user to *digest*
     * a FoodCollection.
     * @public
     */
    class FoodQuery {
        /**
         * Construct a FoodQuery object.
         * @param {Object} query
         * @param {string|undefined} query.search - Optional keyword used
         *     to filter a FoodCollection based on `foodEn` and `foodNative`
         *     properties.
         * @param {string|undefined} query.sort   - Optional *sortable*
         *     property used to sort a FoodCollection: `alias`, `foodEn`,
         *     `foodNative`, `catPerson1` or `catPerson2`.
         * @param {string|undefined} query.cats   - Optional standardized
         *     Viome® categories for Person 1 and Person 2 respectively:
         *     `Superfood`, `Enjoy`, `Minimize` or `Enjoy`. Further arguments
         *     are ignored by the constructor.
         * @returns {FoodQuery} A FoodQuery instance.
         */
        constructor({ search, sort, ...cats }) {
            // Set and validate inputs of query.
            // Validation is self-healing. Whenever a
            // bad parameter is detected, a null value
            // is returned. A null value means the 
            // property won't be used when the Query
            // is later digested by FoodCollection.digest(). 
            this.search      = this.validateParamSearch(search);
            this.sort        = this.validateParamSort(sort);
            this[catPerson1] = this.validateParamCat(cats[catPerson1]);
            this[catPerson2] = this.validateParamCat(cats[catPerson2]);
        }

        /**
         * Validate parameter `search`.
         * @param {string|undefined} param - A search keyword.
         * @returns {string|null} A sanitized version of argument `param`. All
         *     punctuation characters and digits are removed; only letters and
         *     spaces are kept. If `param` is undefined, a `null` value is returned.
         */
        validateParamSearch(param) {
            if (param) {
                // Create a regular expression that captures all
                // punctuation groups from Unicode, all ASCII
                // punctuation characters and all digits.
                const filterRegEx = new RegExp(/[\u2000-\u206F\u2E00-\u2E7F\\'!'#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~0123456789]/, 'g');

                // Return sanitized value.
                return param.replace(filterRegEx, '');
            } else {
                return null;
            }
        }

        /**
         * Validate parameters `catPerson1` and `catPerson2`.
         * @param {string|undefined} param - Standardized Viome® category.
         * @returns {string|null} Argument `param` is returned if it matches
         *    a standard value. Else, a `null` value is returned.
         */
        validateParamCat(param) {
            return (stdCats.indexOf(param) > -1) ? param : null;
        }

        /**
         * Validate parameter `sort`.
         * @param {string|undefined} param - *Sortable* property of a Food
         *     instance.
         * @returns {string|null} Argument `param` is returned if it matches
         *    a *sortable* property of the Food class. Else, a `null` value is
         *    returned.
         */
        validateParamSort(param) {
            return (sortableKeys.indexOf(param) > -1) ? param : null;
        }
    }

    // Print map between persons and their
    // underlying keys before returning.
    // "\x1b[0m" is a code that resets colors.
    console.log(
        '\x1b[32m[digest] using these \x1b[36mkeys \x1b[32mfor persons and categories:',
        `\x1b[36m{ ${keyPerson1} => ${catPerson1}, ${keyPerson2} => ${catPerson2} }.\x1b[0m`
    );

    return { Food, FoodCollection, FoodQuery };
}
