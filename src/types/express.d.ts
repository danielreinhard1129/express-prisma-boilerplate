import { JwtPayload } from "../middleware/jwt.middleware";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
