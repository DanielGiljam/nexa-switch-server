import express from "express";
import morgan from "morgan";
import { execSync } from "child_process";
import z from "zod";
import { fromZodError } from "zod-validation-error";
import arg from "arg";

const args = arg(
  {
    "--port": Number,
    "-p": "--port",
  },
  { permissive: true }
);

const app = express();

app.use(morgan("combined"));

// https://github.com/nbogojevic/piHomeEasy#running-the-tool
const querySchema = z.object({
  pinNumber: z.coerce
    .number()
    .int()
    .pipe(z.union([z.number().min(0).max(12), z.number().min(14).max(16)])),
  emitterId: z.coerce.number().int().gte(0).lte(67108863),
  receiverId: z.coerce
    .number()
    .int()
    .pipe(z.union([z.literal(-1), z.number().gte(0).lte(15)])),
  command: z.enum(["on", "off"]),
});

const getCommand = (req: express.Request) => {
  const { pinNumber, emitterId, receiverId, command } = querySchema.parse(
    req.query
  );
  return `piHomeEasy ${pinNumber} ${emitterId} ${receiverId} ${command}`;
};

app.post("/", (req, res) => {
  let command: string;
  try {
    command = getCommand(req);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodValidationError = fromZodError(error);
      console.error(error);
      res.status(400).send(zodValidationError);
    } else {
      console.error(error);
      res.status(500).send();
    }
    return;
  }
  console.log(command);
  try {
    execSync(command, { stdio: "inherit" });
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

const port = args["--port"] ?? 3000;

app.listen(port, () =>
  console.log(`nexa-switch-server listening on port ${port}`)
);
