Version 1.1.0 // 2021-04-17

* Better documentation. More concise.
* Support for (more) flexible Food data structures.
    * Properties' holding food categories can now be customized and named 
    by following the `cat[USER-KEY]` pattern.
    * Module now exposes a single function to which these custom names are
    passed. The function then exposes the usual classes of the package
    (customized versions based on custom names).
    * Property `imgFile` becomes optional. If unused, it is set equal to
    an empty string.
    * Property `foodFr` is renamed `foodNative`. It is now optional. If
    unused, it is set equal to `foodEn`. This is not perfect, and future
    versions of `digest` will optimize this (so that it is properly
    ignored when `FoodCollection` are searched, filtered and sorted).

Version 1.0.0 // 2021-04-16
---------------------------

* Initial release.
