const defaultGpuOpts = {
};

let socket;
let loaded = []

let lock = false;
function loadScript(url, integrity, callback, callbackParams) {
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
	if (integrity != null) {
		script.integrity = integrity;
		script.crossorigin = "anonymous";
	}

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    if (callback != null) {
		let func = function() {
			if (callbackParams != null) {
				callback(callbackParams[0], callbackParams[1], callbackParams[2]);
			} else {
				callback();
			}
		}
		script.onreadystatechange = func;
		script.onload = func;
	} else {
		lock = true;
		let call = function() {
			lock = false;
		}
		script.onreadystatechange = call;
		script.onload = call;
		while (lock) {}
	}
	
	loaded.push(url);
	
    // Fire the loading
    head.appendChild(script);
}

// Script loading
loadScript("https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js", "sha256-WPeFPWD3PZQUDrpFnDM1N2KadNVwCfNS4cCZ78b76T8=", function() {
	client();
});

function loadRemoteFunctionDeps(remoteFunction, callback, ii) {
	let i = ii || 0;
	if (!loaded.includes(remoteFunction.deps[i].url)) {
		loadScript(remoteFunction.deps[i].url, remoteFunction.deps[i].integrity, i == remoteFunction.deps.length-1 ? function() {callback();} : loadModuleDeps, [remoteFunction, callback, i+1]);
	}
}

// Actual code starts here
function client() {
    socket = io("http://localhost:3000");
	
	socket.emit("postConnection", "slave");
	
	socket.on("executeRemoteFunction", function(remoteFunction, debug) {
		loadRemoteFunctionDeps(remoteFunction, function() {
			let remoteFunctionOut = eval("(" + remoteFunction.func + ")(remoteFunction.args, debug)");
			socket.emit("remoteFunctionOut", remoteFunctionOut);
		});
	});
}