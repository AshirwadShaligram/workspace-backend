import { supabase } from "../db/db.config.js";

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email.split("@")[0],
      ...user.user_metadata,
    };

    req.supabaseClient = supabase;

    next();
  } catch (error) {
    console.error("Auth middleware error: ", error);
    return res.status(500).json({ error: "Invalid or expired token" });
  }
};

export { authenticateToken };
