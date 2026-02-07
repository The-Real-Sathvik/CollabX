import { users } from "../data/fakeDB.js";

// SIGN UP
export const signup = (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  // Check if user already exists
  const existingUser = users.find(user => user.email === email);

  if (existingUser) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  // Create new user
  const newUser = {
    id: users.length + 1,
    email,
    password // ⚠️ plain text for now (Phase 4 fixes this)
  };

  users.push(newUser);

  return res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser.id,
      email: newUser.email
    }
  });
};

// LOGIN
export const login = (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  // Find user
  const user = users.find(
    user => user.email === email && user.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials"
    });
  }

  return res.status(200).json({
    message: "Login successful",
    user: {
      id: user.id,
      email: user.email
    }
  });
};
