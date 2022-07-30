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
