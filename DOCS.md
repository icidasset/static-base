# cleanPath

Cleans up a "path", that is, removes trailing slashes,
leading slashes or dot-slashes.

**Parameters**

-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `options` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=**  (optional, default `{}`)
    -   `options.beginning` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 
    -   `options.end` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The cleaned up path

# run

Run a sequence of functions.
Has support for functions that return a promise.

**Parameters**

-   `arg` **([function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)|\[[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function), Any])=** e.g. run(fn_a, fn_b, [fn_c, 'fn_c_arg'])

Returns **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** Returns a function which runs the sequence and returns a promise
