import express from "express";
import "./configs/dbConfig";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUploadRoutes from "./routes/fileUploadRoutes";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_ENDPOINT,
  credentials: true
}));

const appEndpoint = process.env.APP_ENDPOINT;

app.use(`/${appEndpoint}/auth`, authRoutes);
app.use(`/${appEndpoint}/`, fileUploadRoutes);

export default app;