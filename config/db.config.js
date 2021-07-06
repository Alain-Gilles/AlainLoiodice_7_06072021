// module.exports = {
//   HOST: "localhost",
//   USER: "root",
//   PASSWORD: "aZlW69bY@38a",
//   DB: "bdmessagerie1",
//   dialect: "mysql",
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
// };
module.exports = {
  HOST: "localhost",
  USER: process.env.VE_USER,
  PASSWORD: process.env.VE_PASSWORD,
  DB: process.env.VE_DB,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
