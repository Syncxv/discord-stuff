# Modules

OK IM GONNA GO REALLY INDEPTH on what a module is in javascript

ok lets say we have a file called `a.ts` and it has this code

```ts
//a.ts
function add(x: number, y: number): number {
    return x + y;
}
```

NOW lets say our main `index.ts` file wants to use this code. HOW DO WE DO IT?

```ts
//index.ts
add(1, 2); //add not defined
```

WE need to export the function from `a.ts` so other js files can see it.

```ts
//a.ts
export function add(x: number, y: number): number {
    return x + y;
}
```

IMAGINE this a.js file is a object `{}` and it currently has nothing in it HOWEVER when we do `export ...` we are adding stuff into this object `{}` lets call this object exports :)

the above block is being converted to the one below
(ofc this is not whats atually happening underneath this is a very simplifed version hEHHEE)

```ts
let exports = {
    add: function add(x: number, y: number): number {
        return x + y;
    },
};
```

![](https://i.imgur.com/6n24HvP.png)

add function is being inserted into the exports object :O

go to [testing-grounds/src/example1](https://github.com/Syncxv/discord-stuff/tree/master/testing-grounds/src/example1) and go to `index.ts`

when we do `import bruh from './a.ts'` we look for default in the exports object so `exports.default` HOWEVER there is no default so it will result in this error `Module '"C:/discord-stuff/testing-grounds/src/example1/a"' has no default export.` :P

for the 2nd import statement `import * as bruh from './a'` we just return the entire exports object and then do `as bruh` to name it bruh. THEN WE CAN do `bruh.add` HEHEH HA

now lets `export default` something

```ts
export function add(x: number, y: number): number {
    return x + y;
}

export default 'HEHHE HA';
```

WE exported a string `'HEHHE HA'` this is what the exports object looks like now

```ts
let exports = {
    add: function add(x: number, y: number): number {
        return x + y;
    },
    default: 'HEHHE HA',
};
```

![](https://i.imgur.com/2XmVFlF.png)

if we now do `import bruh from './a.ts'` bruh will be `exports.default` WHICH is just the `'HEHHE HA'` STRING
WASNT THAT COOL

AND if we do `import * as bruh from './a'` we will still get `bruh.add` AND `bruh.default` :D THATS VERY COOL RIGHT
exports are just objects :D (ofc theres more to it thann that HEHHE but thats all you need to know to use it :D)

there are other features for exports and imports and i suggest you read about it on mdn :D
<br />
https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export
<br />
https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/import
