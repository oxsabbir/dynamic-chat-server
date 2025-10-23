import serverApp from "./index";

serverApp.listen(4000, () => {
  console.log("Server listening at port 4000");
});

process.on("unhandledRejection", (err: Error) => {
  console.log(err.message, err.name);
  serverApp.close(() => {
    process.exit(1);
  });
});
