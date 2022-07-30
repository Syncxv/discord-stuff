import HEHEHA from './coolWebpack';

console.log(HEHEHA);

const push = (push, args) => {
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

const injectAfter = (moduleObject, functionName, callback) => {
    const functionToPatch = moduleObject[functionName];
    moduleObject[functionName] = function () {
        const returnValue = functionToPatch.apply(this, arguments);
        try {
            return callback(this, arguments, returnValue);
        } catch (e) {
            console.error('PATCHER ERROR: ', e);
            return returnValue;
        }
    };
};
