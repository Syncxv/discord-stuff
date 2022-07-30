export const webpack = {
    all: () =>
        Object.keys(webpack.instance.cache)
            .map((x) => webpack.instance.cache[x].exports)
            .filter((x) => x), // Get all modules

    find: (filter) => {
        // Generic find utility
        for (const m of webpack.all()) {
            if (m.default && filter(m.default)) return m.default;
            if (filter(m)) return m;
        }
    },

    findAll: (filter) => {
        // Find but return all matches, not just first
        const out = [];

        for (const m of webpack.all()) {
            if (m.default && filter(m.default)) out.push(m.default);
            if (filter(m)) out.push(m);
        }
    },

    findByProps: (...props) => webpack.find((m) => props.every((x) => m[x] !== undefined)), // Find by props in module
    findByPropsAll: (...props) => webpack.findAll((m) => props.every((x) => m[x] !== undefined)), // Find by props but return all matches

    findByPrototypes: (...protos) => webpack.find((m) => m.prototype && protos.every((x) => m.prototype[x] !== undefined)), // Like find by props but prototype

    findByDisplayName: (name) => webpack.find((m) => m.displayName === name), // Find by displayName
    findByDisplayNameAll: (name) => webpack.findAll((m) => m.displayName === name), // Find *all* by displayName

    findByModuleId: (id) => webpack.instance.cache[id],
    async init() {
        delete webpack.init;
        webpack.instance = {};
        webpackChunkdiscord_app.push([
            [[Math.random().toString(36)]],
            {},
            (r) => {
                webpack.instance.cache = r.c;
                webpack.instance.require = (m) => r(m);
            },
        ]);
    },
};

// export default 'HEHHE HA';
