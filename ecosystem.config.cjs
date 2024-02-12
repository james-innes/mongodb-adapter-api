module.exports = {
	apps: [
		{
			name: "mongodb-adapter-api",
			script: "./index.js",
			exec_mode: "cluster",
			instances: "max",
			watch: true,
			max_memory_restart: "4G",
		},
	],
};
