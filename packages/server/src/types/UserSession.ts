import { Session, SessionData } from 'express-session';
import User from '../../../src/types/User';

type UserSession = Session & Partial<SessionData> & {
  user: User
}

export default UserSession;
