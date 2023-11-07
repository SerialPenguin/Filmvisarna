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

  const registerRes = await fetch(
    "http://localhost:5173/api/auth/register",
    registerOptions
  );

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

    const loginRes = await fetch(
      "http://localhost:5173/api/auth/login",
      loginOptions
    );

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

async function handleLogin(e, credentials) {
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

  const res = await fetch("http://localhost:5173/api/auth/login", options);

  if (res.status === 200) {
    const data = await res.json();
    const token = data.token;
    sessionStorage.setItem("JWT_TOKEN", token);
    return true;
  } else {
    return await res.text();
  }
}

const authService = { handleRegister, handleLogin };
export default authService;
