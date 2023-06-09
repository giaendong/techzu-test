require("dotenv").config();
import { sign } from "jsonwebtoken";

export function createSecretToken(id) {
  return sign({ id }, process.env.JWT_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
}