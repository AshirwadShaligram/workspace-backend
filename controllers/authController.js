const { supabase } = require("../db/db.config.js");

const setCookies = (res, refreshToken) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    path: "/api/auth/refresh",
  });
};

// User registration
const register = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "name, email and password required" });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) {
      console.error("Registration error: ", error);
      return res.status(400).json({ error: error.message });
    }

    setCookies(res, data.session.refresh_token);

    res.status(201).json({
      message: "User register successfully",
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: name,
      },
      session: data.session,
    });
  } catch (error) {
    console.error("Registration error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// User login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password required" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error: ", error);

      if (error.message.includes("Invalid login credentials")) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      return res.status(401).json({ error: error.message });
    }

    const refreshToken = data.session.refresh_token;

    setCookies(res, refreshToken);

    res.json({
      message: "Login successfully",
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.email.split("@")[0],
      },
      session: data.session,
    });
  } catch (error) {
    console.error("Login error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error: ", error);
      return res.status(500).json({ error: "Failed to logout" });
    }

    res.clearCookie("refreshToken", {
      path: "/api/auth/refresh",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    });

    res.json({ message: "Logout Successfully" });
  } catch (error) {
    console.error("Logout error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user info
const userProfile = async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
    },
  });
};

// Refresh token
const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is required" });
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    setCookies(res, data.session.refresh_token);

    res.json({
      message: "Token refreshed successfully",
      session: data.session,
    });
  } catch (error) {
    console.error("Token refresh error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { register, login, logout, userProfile, refreshToken };
