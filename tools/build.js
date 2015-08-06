{
	"baseUrl": "../lib",
	"paths": {
		"trace": "../trace"
	},
	"include": ["../tools/almond", "trace"],
	"exclude": ["d3"],
	"out": "../trace-min.js",
	"preserveLicenseComments": true,
	"wrap": {
		"startFile": "wrap.start",
		"endFile": "wrap.end"
	}
}