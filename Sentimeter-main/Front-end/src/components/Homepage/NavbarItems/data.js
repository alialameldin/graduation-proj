const home = {
  text: "Home",
  icon: "home",
  url: "/",
  type: "standard",
};

const about = {
  text: "About us",
  icon: "users",
  url: "/about",
  type: "standard",
};

const tool = {
  text: "Dataset Creator",
  icon: "tools",
  url: "/dataset_creator",
  type: "standard",
};

const login = {
  text: "Login",
  icon: "sign-in-alt",
  url: "/login",
  type: "login",
};

const signup = {
  text: "Sign up",
  icon: "user-plus",
  url: "/signup",
  type: "signup",
};

const dashboard = {
  text: "Go to dashboard",
  icon: "user-cog",
  url: "/dashboard",
  type: "login",
};

const logout = {
  text: "logout",
  icon: "sign-out-alt",
  url: "/logout",
  type: "signup",
};

const navItems1 = [home, about, tool];
const navItems2 = [login, signup];
const mobileNavItems = [home, about, tool, login, signup];
const mobileLoggedinNavItems = [home, about, tool, dashboard, logout];
const loggedInNavItems = [dashboard, logout];

export { navItems1, navItems2, mobileNavItems, mobileLoggedinNavItems, loggedInNavItems };
