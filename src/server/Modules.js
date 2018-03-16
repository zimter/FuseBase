let Module = require('./Module.js');
const fs = require('fs');

const pluginFolder = "./plugins/";
const pluginFolderRelative = "../../plugins/";

fs.readdirSync(pluginFolder).forEach(file => {
	let module = require(pluginFolderRelative+file);
	console.log(module.config);
});