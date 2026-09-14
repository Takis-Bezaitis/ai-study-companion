import { useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";
import Button from "../components/ui/Button";
import { API } from "../api/api";

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  // Demo accounts for recruiters
  const DEMO_PASSWORD = "passworD123!";

  const demoUsers = [
    { username: "Barry", email: "barry@example.com" },
  ];

  const loginAsDemoUser = async (email: string) => {
    setDemoLoading(email);
    await handleSubmit(undefined, email, DEMO_PASSWORD);
    setDemoLoading(null);
  };

  const handleSubmit = async (e?: SubmitEvent, demoEmail?: string, demoPassword?: string) => {
    e?.preventDefault();

    const loginEmail = demoEmail ?? email;
    const loginPassword = demoPassword ?? password;

    try {
        const res = await fetch(API.auth.login, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            email: loginEmail,
            password: loginPassword,
        }),
        });

        const result = await res.json();

        if (!res.ok) {
        toast.error(result.error || "Login failed");
        return;
        }

    const { user, accessToken } = result.data;

    setUser(user);
    setToken(accessToken);

    navigate("/dashboard");
        } catch (err) {
        setError("Server error");
        console.error(err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-dvh bg-gray-50">
        <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className="bg-white px-8 py-6 rounded-xl shadow-lg w-full max-w-sm"
        >
            <h1 className="text-2xl mb-4 text-center">Login</h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <label className="block mb-2">
            Email
            <input
                type="email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={demoLoading !== null}
                className="w-full p-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
            />
            </label>

            <label className="block mb-4">
            Password
            <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={demoLoading !== null}
                className="w-full p-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
            />
            </label>

            <Button 
            type="submit" 
            fullWidth 
            disabled={demoLoading !== null}>
            Login
            </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-3">
            Initial load may take 20–30 seconds while the server wakes up.
        </p>

        <p className="text-center text-lg mt-6 mb-2">
            Demo accounts
        </p>

        <div className="grid grid-cols-2 gap-3 mt-2">
            {demoUsers.map((user) => (
            <Button 
                key={user.email}
                onClick={() => loginAsDemoUser(user.email)}
                disabled={demoLoading !== null}
            >
                {demoLoading === user.email
                ? "Logging in..."
                : `Login as ${user.username}`}
            </Button>
            ))}
        </div>
        </div>
    );
};

export default Login;
