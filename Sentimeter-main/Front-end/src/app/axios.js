import axios from "axios";
import { JWTCookie } from "./cookie";

const jwt = new JWTCookie();

const Axios = axios.create({
  headers: {
    Authorization: jwt.get(),
  },
});

export default Axios;
