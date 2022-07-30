## good day

hello this is a collection of scripts and shit that i think are useful gg ez

---

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

# Modifying Ui / Injecting into the ui

im gonna use powercords stuff bec i like it :)

<br />

discord uses react to render their sheet. SO if you know react this will be pretty ez.

OK lets try an example. lets say i want to add a div with the text hi here:

![](https://i.imgur.com/EYYzF94.png)

how would i go about doing that? FIRST you need to know which module you want to inject into. using the chrome extention react developer tools we can find out which element contains these buttons. should look something like this:

![](https://i.imgur.com/G4KCRzA.png)

Now we now we need to inject into the `ChannelTextAreaButtons` react component.
first lets find it

```js
const { getModule } = require('powercord/webpack');
const ChannelTextAreaButtons = getModule((m) => m?.default?.type?.displayName === 'ChannelTextAreaButtons', false);
```

now let me explain HOW i get this. FIRST if you look at that picture again and YOU can see that it says memo. IF It says memo it is most likley exported as a memo SO you cant simply do `getModuleByDisplayName` that wont wrok because its a memo. SO what does a memo functional component look like? well it looks like this wigga boy

![](https://i.imgur.com/auUdT5k.png)

AND as you can see theres a type property AND in this property there will most likely be a displayName :D and we can use that to get our component.
HOWEVER if the type was a component and not a function then you would need to do `m?.default?.type?.render?.displayName ===`

ok we found it now what?

```js
const { inject } = require('powercord/injector');
inject('cool-id', ChannelTextAreaButtons, 'type', (args, res) => {
    console.log(args, res);
    return res;
});
```

now were just going to inject and check what it returns and see if we can modify anything

![](https://i.imgur.com/OgrqH15.png)

AS you can see the children of res has all the buttons in it :D. SO whatq we need to do is just push our own element into this children and return that :O

```js
const { inject } = require('powercord/injector');
const { React } = require('powercord/webpack');
inject('cool-id', ChannelTextAreaButtons, 'type', (args, res) => {
    console.log(args, res);
    const element = React.createElement(
        'div',
        {
            style: {
                width: '20px',
                alignSelf: 'center',
            },
        },
        'hi'
    );
    /* 
    // same as
    <div style={{width: '20px', alignSelf: 'center'}}>
        hi
    </div>
    */
    res.props.children.push(element);
    return res;
});
ChannelTextAreaButtons.type.displayName = 'ChannelTextAreaButtons';
```

result:
![](https://i.imgur.com/QSgBWt6.png)

<br />

ok this is such a shit explanation but ill improve it later :)
