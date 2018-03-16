let Module = require('./Module.js');
const fs = require('fs');

const pluginFolder = "./plugins/";
const pluginFolderRelative = "../../plugins/";

const modules = [];

fs.readdirSync(pluginFolder).forEach(file => {
	let module = require(pluginFolderRelative+file);
	modules.push(module);
});

module.exports = modules;