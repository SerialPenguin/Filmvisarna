export async function get(url) {
  return await (await fetch(url)).json();
}

export async function post(url, body) {
  return await (
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  ).json();
}

export async function adminPost(url, body, token) {
  return await (await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
   },
    body: JSON.stringify(body)
  })).json();
}

export async function patchPw(url, body) {
  return await (
    await fetch(url, {
      method: "PATCH" /* Or PATCH */,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
  ).json();
}

export async function patch(url, body, token) {
  return await (
    await fetch(url, {
      method: "PATCH" /* Or PATCH */,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
  ).json();
}

export async function authGet(url, token) {
  return await (await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  })).json();
}

export async function del(url, token) {
  return await (await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  })).json();
}
