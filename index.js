const { awaitSync } = require("glome-deasync");
const { performance } = require("perf_hooks");

async function main() {
    const promise = new Promise(resolve => setTimeout(resolve, 5000)).then(() => "wake up!")
    const promise2 = new Promise(resolve => setTimeout(resolve, 1000)).then(() => "wake up!")
    promise2.then(()=>console.log("hi 1000"))
    console.log("Timestamp before: " + performance.now());
    
    console.log(awaitSync(promise));
    console.log("Timestamp after: " + performance.now());
}

main();
