import { app, errorHandler } from "mu";

import bodyParser from "body-parser";
import { Delta } from "./lib/delta";
import { RDF_TYPE_NS } from "./constants";
import { askByType, makeTombstone } from "./lib/queries";


app.use(
  bodyParser.json({
    type: function (req) {
      return /^application\/json/.test(req.get("content-type"));
    },
  }),
);

app.get("/", function (_, res) {
  res.send("Hello tombstone service");
});

app.post("/delta", async function (req, res, next) {
  try {
    const entries = new Delta(req.body).getDeletesFor(
      RDF_TYPE_NS,
    );
    if (!entries.length) {
      console.log(
        "Delta dit not contain interesting deletes",
      );
      return res.status(204).send();
    }
    for (let entry of entries) {
      // NOTE: we don't wait as we do not want to keep hold off the connection.
      run(entry);
    }
    return res.status(200).send().end();
  } catch (e) {
    console.log(
      `Something unexpected went wrong`,
    );
    console.error(e);
    return next(e);
  }
});

async function run(entry) {
  if (!(await askByType(entry.subject))) {
    // if type is no longer in the db, it's probably a hard delete. we then push
    // a tombstone
    await makeTombstone(entry.subject, entry.object);
  }
}



app.use(errorHandler);
