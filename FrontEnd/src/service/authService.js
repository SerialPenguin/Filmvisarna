async function handleRegister(e, credentials) {
  e.preventDefault();
  const registerOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      emailAdress: credentials.emailAdress,
      password: credentials.password,
    }),
  };

  const registerRes = await fetch("/api/auth/register", registerOptions);

  if (registerRes.status === 201) {
    const loginOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailAdress: credentials.emailAdress,
        password: credentials.password,
      }),
    };

    const loginRes = await fetch("/api/auth/login", loginOptions);

    if (loginRes.status === 200) {
      const data = await loginRes.json();
      const token = data.token;
      sessionStorage.setItem("JWT_TOKEN", token);
      return true;
    } else {
      return await loginRes.text();
    }
  } else {
    return await registerRes.text();
  }
}

async function handleLogin(e, credentials, callback) {
  e.preventDefault();
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      emailAdress: credentials.emailAdress,
      password: credentials.password,
    }),
  };

  try {
    const res = await fetch("/api/auth/login", options);

    if (res.status === 200) {
      const data = await res.json();
      const token = data.token;
      sessionStorage.setItem("JWT_TOKEN", token);
      callback();
    } else {
      const errorText = await res.json();
      console.error("Login failed:", errorText);
      callback(errorText.error);
    }
  } catch (error) {
    console.error("Login failed:", error);
    callback("Något gick fel. Försök igen.");
  }
}

const authService = { handleRegister, handleLogin };
export default authService;
