async function handleRegister(e, credentials) {
  e.preventDefault();
  const options = {
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

  const res = await fetch("http://localhost:5173/api/auth/register", options);

  if (res.status === 201) {
    return true;
  } else {
    return await res.text();
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
    sessionStorage.setItem("JWT_TOKEN", data.token);
    return true;
  } else {
    return await res.text();
  }
}

const authService = { handleRegister, handleLogin };
export default authService;
