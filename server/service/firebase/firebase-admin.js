import {} from "fire"
import { firebaseCredentials } from "../../firebaseService.js";

//allows server to verify ID tokens and manage authentication-related tasks
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseCredentials),
  });
}

export default admin;
