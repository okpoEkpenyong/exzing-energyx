// frontend/web/src/pages/loginPage.tsx
import React, { useState } from "react";
import { Stack, Text, TextField, PrimaryButton, DefaultButton, MessageBar, MessageBarType } from "@fluentui/react";
import { login, isAuthenticated } from "../services/authService";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await login(username, password);
      setLoading(false);
      if (res.token) {
        navigate("/dashboard");
      } else {
        setErr("Login failed");
      }
    } catch (e: any) {
      console.error("login error", e);
      setErr(String(e?.message ?? e));
      setLoading(false);
    }
  };

  if (isAuthenticated()) {
    // already logged in: quick redirect
    navigate("/dashboard");
    return null;
  }

  return (
    <Stack tokens={{ childrenGap: 12 }} styles={{ root: { padding: 20, maxWidth: 420, margin: "40px auto" } }}>
      <Stack horizontal horizontalAlign="center">
        <Text variant="xxLarge">Exzing EnergyX</Text>
      </Stack>

      <Text variant="large">Sign in</Text>
      {err && <MessageBar messageBarType={MessageBarType.error}>{err}</MessageBar>}

      <TextField label="Email / Username" value={username} onChange={(_, v) => setUsername(v || "")} />
      <TextField label="Password" type="password" value={password} onChange={(_, v) => setPassword(v || "")} />

      <Stack horizontal tokens={{ childrenGap: 8 }}>
        <PrimaryButton text={loading ? "Signing in..." : "Sign in"} onClick={onSubmit} disabled={loading || !username || !password} />
        <DefaultButton text="Cancel" onClick={() => { setUsername(""); setPassword(""); }} />
      </Stack>

      <Text variant="small" styles={{ root: { color: "#666" } }}>
        For MVP, if no backend auth exists we provide a local mock session so you can continue testing.
      </Text>
    </Stack>
  );
};

export default LoginPage;
