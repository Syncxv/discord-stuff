## good day

hello this is a collection of scripts and shit that i think are useful gg ez

---

<h2>Get All Discord Modules</h2>

first what is a module?, A module is a function, class etc THAT discord uses for their app
LIKE FOR EXAMPLE discord has a function for sorting your friends or function for sending message etc yk

WE CAN INJECT into these functions and modify or completely change how they work

first how do we get all these modules you ask?

```js
// prettier-ignore
function getAllModules() {
       return new Promise((res) =>  webpackChunkdiscord_app.push([
            [[Math.random().toString(36)]],
            {},
            (r) => res(r.c),
        ]))
    }
```

<details>
    <summary>How this function works. Dont really need to know, its not important
    </summary>
  
  so you might be confused on HOW this gets all the modules and rightfully so. Disocrd uses webpack to transplile and code split their web app AND THEY HAVE enabled the webpack jsonp thingy or in this case webpackchunkdiscord_app. i dont really understand it on a deep level but i do know that webpackChunkdiscord_app is how they emulate the import / export or module.exports thingy yk. IT is the modules object and thats where they store all the modules so other modules can import export stuff yk.

now why am i pussing all this shit? this wont do anything right it will just add it to the array right?
NO this push function is a wrapper over the original push function that allows us to insert modules into it
WHAT THIS MEANS is we can add our own module into this webpackChunk and then WE ARE bascially in the same enviroment as discords functions and modules. SO WE CAN IMPORT THEIR modules yk

heres the function that `webpackChunkdiscord_app.push` function
ofc i renamed some variables and refactored the minfied code to make it more readable

```js
// prettier-ignore
const wrappedPush = (push, args) => {
    //the arguments you passed for example: push([["id"], {}, (r) => {console.log(r)}])
    //ids will be ["id"], modules will be {} and the callback will be  (r) => {console.log(r)}
    const [ids, modules, callback] = args;
    if (ids.some((c) => 0 !== e[c])) {
        for (let module in modules) webpackMagic.o(modules, module) && (webpackMagic.m[module] = modules[module]);
        if (callback) var o = callback(webpackMagic);
    }
    push && push(args);
    for (let n = 0; n < ids.length; n++) {
        const id = ids[n];
        webpackMagic.o(e, id) && e[id] && e[id][0]();
        e[ids[n]] = 0;
    }
    return webpackMagic.O(o);
};
```

from this function we can see THEY GIVE us the webpack magic (which i dont understand how it works WHICH IS WHY i call it magic HEHEHE) AND THIS webpqack magic will HAVE ALL THE MODULES and ALL THE CHUNKS.
the callback we pass as the 3rd element in the array will give us the webpack magic (see line 8 of that code wrapper push function) and in the webpack magic theres a property that has the cache or all the functions that have been called or used / imported (i think.) this will be different for each web app but for discord the property is r.c or just c

The `modules` argument will be huge with many modules you can just look at discords minified code and see how big it is.

</details>

<br/>

this `getAllModules` function will return ALL the modules that discord has used
ofc lazy loaded stuff wont be in here :(

WITH this we can convert the object into an array and then search through it to find a module

example:

```js
const modules = Object.values(await getAllModules()).map((m) => m.exports);
const currentUser = modules
    .find((m) => m?.default?.__proto__?.hasOwnProperty('getCurrentUser') && m?.default?.__proto__?.hasOwnProperty('getUser'))
    .default.getCurrentUser();
```

above code just gets the current user :P

LIKE THIS WE CAN GET react components and OHTER FUNCTIONS that we can modify, disable ETC
THE POSSIBLITIES ARE ENDLESS

<br/>

# Injection / Patching

Better Discord and Powercord (two clients im familar with) have good patchers that are very flexiable HOWEVER today we are trying to learn how to patch :)

so WE ARE GONNA MAKE OUR own patcher :D

so what is a patcher / injection?

basically they try to inject code before the function is called or after the function is called. YOU can also completely replace the function :)

now lets make a simple after injector :)

```js
const injectAfter = (moduleObject, functionName, callback) => {
    //THE original function
    const originalFunction = moduleObject[functionName];
    //replacing the original function with our own :)
    //THIS cant be arrow function because arrow functions dont have this object :P
    moduleObject[functionName] = function () {
        //first run the original function
        const returnValue = originalFunction.apply(this, arguments);
        try {
            //run the call back whcih modifies the return value hopefully
            return callback(this, arguments, returnValue);
        } catch (e) {
            //if an error happens return the original function return value
            console.error('PATCHER ERROR: ', e);
            return returnValue;
        }
    };
};
```

now how do we use this?

```js
const fakeModule = {
    value: 1,
    calculateMoney: function (num) {
        return num + this.value;
    },
};

fakeModule.calculateMoney(1); // 2

injectAfter(fakeModule, 'calculateMoney', (thisObject, args, res) => {
    console.log(thisObject, args, res);
    return 999999999999;
});

fakeModule.calculateMoney(1); // 999999999999
```

as you can see WE MODIFED THE return value for a function, WASNT THAT COOL.

now why dont we use it on a real discord module :)

LETS modify the getUser function from the previous Chapter thingy

lets make someting that will change everyones name to `balls`

```js
//get modules and only get exports of the modules
const modules = Object.values(await getAllModules()).map((m) => m.exports);
//find the user module
//this module is used to getUsers and stuff :) and discord uses it for everything HEHEHHE HA
const usersModuleObject = modules.find(
    (m) => m?.default?.__proto__?.hasOwnProperty('getCurrentUser') && m?.default?.__proto__?.hasOwnProperty('getUser')
).default;

//inject into it and change the username to balls
injectAfter(usersModuleObject, 'getUser', (_, args, res) => {
    if (res != null) res.username = 'balls';
    return res;
});
```

<details>
    <summary> Full Code Snippet </summary>

```js
function getAllModules() {
    return new Promise((res) => webpackChunkdiscord_app.push([[[Math.random().toString(36)]], {}, (r) => res(r.c)]));
}
const injectAfter = (moduleObject, functionName, callback) => {
    //THE original function
    const originalFunction = moduleObject[functionName];
    //replacing the original function with our own :)
    //THIS cant be arrow function because arrow functions dont have this object :P
    moduleObject[functionName] = function () {
        //first run the original function
        const returnValue = originalFunction.apply(this, arguments);
        try {
            //run the call back whcih modifies the return value hopefully
            return callback(this, arguments, returnValue);
        } catch (e) {
            //if an error happens return the original function return value
            console.error('PATCHER ERROR: ', e);
            return returnValue;
        }
    };
};
//get modules and only get exports of the modules
const modules = Object.values(await getAllModules()).map((m) => m.exports);
//find the user module
//this module is used to getUsers and stuff :) and discord uses it for everything HEHEHHE HA
const usersModuleObject = modules.find(
    (m) => m?.default?.__proto__?.hasOwnProperty('getCurrentUser') && m?.default?.__proto__?.hasOwnProperty('getUser')
).default;

//inject into it and change the username to balls
injectAfter(usersModuleObject, 'getUser', (_, args, res) => {
    if (res != null) res.username = 'balls';
    return res;
});
```

</details>

<br />

![](https://i.imgur.com/Aop8bTX.png)

pretty cool eh
