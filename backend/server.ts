import "dotenv/config";
import app from "./src/app";

app.listen(process.env.PORT, () => {
  console.log("Server running on port 3000");
});