export NODE_ENV = production

build:
	babel src/index.js | uglifyjs -b -o lib/index.js && uglifyjs lib/index.js -m -c -o lib/index.min.js
	babel src/CockpitRealTime.js | uglifyjs -b -o lib/CockpitRealTime.js && uglifyjs lib/CockpitRealTime.js -m -c -o lib/CockpitRealTime.min.js
