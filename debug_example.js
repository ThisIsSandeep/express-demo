const startDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');

startDebugger('export DEBUG=app:startup');
dbDebugger('Database realted logs');

// Prefer debug module over console.log b/c it gives more control over log
