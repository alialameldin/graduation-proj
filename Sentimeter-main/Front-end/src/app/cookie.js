import Cookies from "universal-cookie";

class JWTCookie {
  save = (response) => {
    const date = new Date();
    date.setDate(date.getDate() + parseInt(response.data.expiresIn.split("d")));
    const cookies = new Cookies();
    cookies.set("jwt_token", response.data.token, {
      path: "/",
      expires: date,
    });
  };

  get = () => {
    const cookies = new Cookies();
    return cookies.get("jwt_token");
  };

  remove = () => {
    const cookies = new Cookies();
    return cookies.remove("jwt_token", { path: "/" });
  };
}

class UserCookie {
  save = (response) => {
    const date = new Date();
    date.setDate(date.getDate() + parseInt(response.data.expiresIn.split("d")));
    const cookies = new Cookies();
    cookies.set("current_user", JSON.stringify(response.data.user), {
      path: "/",
      expires: date,
    });
  };

  get = () => {
    const cookies = new Cookies();
    return cookies.get("current_user");
  };

  remove = () => {
    const cookies = new Cookies();
    return cookies.remove("current_user", { path: "/" });
  };
}

export { JWTCookie, UserCookie };
