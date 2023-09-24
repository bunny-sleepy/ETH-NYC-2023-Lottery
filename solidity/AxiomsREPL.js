//
//                 _                 _____  ______ _____  _      
//     /\         (_)               |  __ \|  ____|  __ \| |     
//    /  \   __  ___  ___  _ __ ___ | |__) | |__  | |__) | |     
//   / /\ \  \ \/ / |/ _ \| '_ ` _ \|  _  /|  __| |  ___/| |     
//  / ____ \  >  <| | (_) | | | | | | | \ \| |____| |    | |____ 
// /_/    \_\/_/\_\_|\___/|_| |_| |_|_|  \_\______|_|    |______|
//                                                              
//                                                               

// Axiom REPL circuit to prove that an account once transfered the token USDC of amount at least 1000000000000 (1K USDC)

// fetch receipt data
// Transfer (index_topic_1 address from, index_topic_2 address to, uint256 tokens)
// https://goerli.etherscan.io/tx/0xe26aecfb41130978e4f3f79a5bb2d76b88abf645380c8b194fa8fd86e9e978f8
const eventSchema = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

// get a transaction receipt for a specific `txHash`
let receipt = getReceipt(txHash);

// only one log
let receiptLog = receipt.log(0);

// get the topic at index 0 (event schema)
let transferSchema = receiptLog.topic(0, eventSchema);

// get the topic at index 1 (indexed address `from`)
let from = receiptLog.topic(1, eventSchema).toCircuitValue();
// check transfer value
const amount = receiptLog.data(0).toCircuitValue();
checkLessThan(constant(100000000000), amount)
assertEqual(from, address)

// adds each of our desired variables to the callback. The callback returns the 
// values as an array in the order that `addToCallback` was called. 
addToCallback(address);
addToCallback(amount);
