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

  const res = await fetch("http://127.0.0.1:3000/api/auth/register", options);

  if (res.status === 201) {
    return true;
  } else {
    return await res.text();
  }
}

const authService = { handleRegister };
export default authService;
