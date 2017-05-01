// @see https://nodejs.org/api/cluster.html
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const logger = require('menna')

const setupExpress = require('./setupExpress')

if (cluster.isMaster) {
  // Setup database
  const schema = require('./lib/schemas')()
  schema.Giphys.sync({ force: true })

  logger.info(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.warning(`worker ${worker.process.pid} died`);

    // Retry
    cluster.fork()
  });
} else {
  setupExpress()

  logger.info(`Worker ${process.pid} started`);
}

// TODO: implement e2e/component tests depending on the testing strategy you want to follow
