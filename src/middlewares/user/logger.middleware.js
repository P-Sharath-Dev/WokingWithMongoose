import exp from "constants";
import fs from "fs";
import winston from "winston";

const fsPromise = fs.promises;

// const addLog = async (data, url) =>{
//     data = `\n Time :${new Date()},reqBody: ${JSON.stringify(data)}, from Url : ${url}`;
//     try{
//         await fsPromise.appendFile('logs.txt', data);
//     }
//     catch (error){
//         console.log(error);
//     }
// }

const winstonLogger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "E-commerce app" },
  transports: [new winston.transports.File({ filename: "logs.txt" })],
});

// Winston Logger for Error Logs
const errorLogger = winston.createLogger({
  level: "error",
  format: winston.format.json(),
  defaultMeta: { service: "E-commerce app" },
  transports: [
    new winston.transports.File({ filename: "errors.log" }), // Error logs
  ],
});

const logger = async (req, res, next) => {
  //method to write req to file : logs.txt
  //check for login/signin path
  // if (!req.url.includes('user')) {
  //     await addLog(req.body, req.originalUrl);
  // }
  // await addLog(req.body, req.originalUrl);
  const data = `\n Time :${new Date().toString()},reqBody: ${JSON.stringify(
    req.body
  )}, from Url : ${req.url}`;
  winstonLogger.info(data);
  next();
};

export { winstonLogger, errorLogger };
export default logger;
