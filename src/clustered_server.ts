import cluster from "cluster";
import { cpus } from "os";
import { app } from "./app";
import { AppDataSource } from "./data-source";

const PORT = 3000;

if (cluster.isPrimary) {
  const numberOfWorkers = cpus().length;

  console.log(`Primary cluster setting up ${numberOfWorkers} workers...`);

  for (let index = 0; index < numberOfWorkers; index++) {
    cluster.fork();
  }

  cluster.on("online", (worker) => {
    console.log(`Worker ${worker.process.pid} id online`);
  });

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died with code ${code} and signal ${signal}`
    );

    console.log("Starting a new worker");
    cluster.fork();
  });
} else {
  const server = app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
  });

  const events = ["exit", "SIGINT", "SIGUSR1", "SIGUSR1", "SIGTERM"];

  events.forEach((e) => {
    process.on(e, () => {
      server.close();
      AppDataSource.destroy();
    });
  });
}
