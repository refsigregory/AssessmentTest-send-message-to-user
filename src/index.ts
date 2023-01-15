require("dotenv").config();
import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import { find } from "geo-tz";
import moment from "moment";
import fs from 'fs';
import { connectDB, sequelize } from "./config/database";
import userRouter from "./routes";
import sendMail from "./utils/sendMail";
import MessageQueueModel from "./models/messageQueueModel";
import UserModel from "./models/userModel";

const app = express();

app.use(express.json({ limit: "10kb" }));
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    code: 200,
    message: "OK",

  });
});

app.use("/users", userRouter);

app.all("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: "fail",
    message: `Route: ${req.originalUrl} does not exist on this server`,
  });
});


/**
 * Checker Events
 */
setInterval(async () => {
  const TIME_SEND_MESSAGE: string = "9"; // in hour, 00-23
  const users = await UserModel.findAll();
  console.log("Checking Today Birthday..");
  for (const row of users) {
    const location: string[] = row.location?.split(",");
    const timeZone: string[] = find(location[0],location[1]);
    const timeNow = moment().tz(timeZone[0]);
    const eventDate = moment(row.birthday, "YYYY-MM-DD").tz(timeZone[0]);

    const fullName = `${row.firstName} ${row.lastName}`;
    const message = `Hey, ${fullName} it's your birthday`;
    const email = row.email;

    //console.log(`Current User Local Time (Hour): ${moment().tz(timeZone[0]).format("HH")} (${timeZone[0]})`);
    //console.log(`Birthday: ${eventDate.format("DD-MM-YYYY")}`);
    //console.log(`${eventDate.format("DD")} = ${timeNow.format("DD")} | ${eventDate.format("MM")} = ${timeNow.format("MM")}`);

    if (eventDate.format("DD") === timeNow.format("DD") && eventDate.format("MM") === timeNow.format("MM")) {
      const queue = await MessageQueueModel.findOne({ where: { userId: row.id, message: message, email: email,}});
      if (!queue) {
        if (moment().tz(timeZone[0]).format("HH") === TIME_SEND_MESSAGE) {
          console.log("=> Added new queue")
          await MessageQueueModel.create({
            userId: row.id,
            name: fullName,
            email: email,
            message: message,
            send: false,
          });
        }
      }
    }
  }
}, 60000);

/**
 * Send Message
 */
setInterval(async () => {
  // Check if has unsend message
  const checkQueue = await MessageQueueModel.findOne({ where: { send: false }});
  if (checkQueue) {
    const dataList = await MessageQueueModel.findAll();
    for (const row of dataList) {
      if (!row.send) {
        console.log("=> Start Sending");
        sendMail({email: row.email, message: row.message}, ).then(async function (response: any) {
          console.log(response.data);
          if (response.data.status === 'sent') {
            console.log("=> SENT!");
            await MessageQueueModel.update(
              { send: true, updatedAt: Date.now() },
              {
                where: {
                  id: row.id,
                },
              }
            );
          } else {
            console.log("=> FAILED");
          }
        })
        .catch(function (error: any) {
          console.log(error);
        });
      }
    }
  }
}, 10000);

const PORT = 8000;
app.listen(PORT, async () => {
  console.log("🚀Server started Successfully");
  await connectDB();
  sequelize.sync({ force: false }).then(() => {
    console.log("✅Synced database successfully...");
  });
});

export default app;