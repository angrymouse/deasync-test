const { awaitSync } = require("glome-deasync");

function isAsyncFunction(fn) {
    return fn && fn.constructor && fn.constructor.name === "AsyncFunction";
}

function wrapAsyncFunction(fn) {
    return (...args) => {
        return awaitSync(fn(...args));
    };
}

module.exports.wait = (ms) => {
    return new Promise(resolve => {
        setTimeout(() => resolve("done waiting"), ms)
    })
}
module.exports.syncify = function syncify(O) {
    if (!O) return O;

    if (Array.isArray(O)) {
        return O.map(item => {
            if (typeof item === "function") {
                if (isAsyncFunction(item)) {
                    return wrapAsyncFunction(item);
                } else {
                    return item;
                }
            } else if (typeof item === "object") {
                return syncify(item);
            } else {
                return item;
            }
        });
    } else if (typeof O === "object") {
        const mO = {};
        for (const k in O) {
            if (O.hasOwnProperty(k)) {
                if (typeof O[k] === "function") {
                    if (isAsyncFunction(O[k])) {
                        mO[k] = wrapAsyncFunction(O[k]);
                    } else {
                        mO[k] = O[k];
                    }
                } else if (typeof O[k] === "object") {
                    mO[k] = syncify(O[k]);
                } else {
                    mO[k] = O[k];
                }
            }
        }
        return mO;
    }
    return O;
};

async function main() {
    const { wait }=module.exports.syncify({
        wait: async () => {
        await module.exports.wait(5000)
        }
    })
    wait()
    console.log("passed wait")
}
main()