"use strict";
const url = "http://localhost:3000/api/v1";
const imageUrl = "http://localhost:3000/uploads/";

const loginWrapper = document.querySelector("#login-wrapper");
const userInfo = document.querySelector("#user-info");
const logOut = document.querySelector("#log-out");
const main = document.querySelector("main");
const loginForm = document.querySelector("#login-form");
const addUserForm = document.querySelector("#add-user-form");
const addForm = document.querySelector("#add-cat-form");
const modForm = document.querySelector("#mod-cat-form");
const ul = document.querySelector("ul");
const userList = document.querySelector(".add-owner");
const imageModal = document.querySelector("#image-modal");
const modalImage = document.querySelector("#image-modal img");
const close = document.querySelector("#image-modal a");

const dt = luxon.DateTime;

let user = JSON.parse(sessionStorage.getItem("user"));
console.log(user);
const startApp = (logged) => {
  console.log(logged);
  loginWrapper.style.display = logged ? "none" : "flex";
  logOut.style.display = logged ? "block" : "none";
  main.style.display = logged ? "block" : "none";
  userInfo.innerHTML = logged ? `Hello ${user.name}` : "";
  if (logged) {
    if (user?.role > 0) {
      userList.remove();
    }
    getCat();
    getUsers();
  }
};

const createCatCards = (cats) => {
  ul.innerHTML = "";
  cats.forEach((cat) => {
    const img = document.createElement("img");
    const [prefix, suffix] = cat.filename.split(".");
    const fileMod = prefix + "_thumb." + suffix;
    img.src = imageUrl + fileMod;
    img.alt = "Image of a cat named " + cat.cat_name;
    img.classList.add("resp");
    img.addEventListener("click", () => {
      modalImage.src = imageUrl + cat.filename;
      imageModal.alt = cat.name;
      imageModal.classList.toggle("hide");
    });

    const figure = document.createElement("figure").appendChild(img);

    const h2 = document.createElement("h2");
    h2.innerHTML = cat.cat_name;

    const p1 = document.createElement("p");
    p1.innerHTML = `Birthdate: ${dt
      .fromISO(cat.birthdate)
      .setLocale("fi")
      .toLocaleString()}`;
    const p1b = document.createElement("p");
    p1b.innerHTML = `Age: ${dt
      .now()
      .diff(dt.fromISO(cat.birthdate), ["year"])
      .toFormat("y")}`;

    const p2 = document.createElement("p");
    p2.innerHTML = `Weight: ${cat.weight}kg`;

    const p3 = document.createElement("p");
    p3.innerHTML = `Owner: ${cat.owner_name}`;

    const li = document.createElement("li");
    li.classList.add("light-border");

    li.appendChild(h2);
    li.appendChild(figure);
    li.appendChild(p1);
    li.appendChild(p1b);
    li.appendChild(p2);
    li.appendChild(p3);
    ul.appendChild(li);
    if (user.role === "admin" || user.user_id === cat.owner) {
      const modButton = document.createElement("button");
      modButton.innerHTML = "Modify";
      modButton.addEventListener("click", () => {
        const inputs = modForm.querySelectorAll("input");
        inputs[0].value = cat.cat_name;
        inputs[1].value = dt.fromISO(cat.birthdate).toFormat("yyyy-MM-dd");
        inputs[2].value = cat.weight;
        modForm.action = `${url}/cats/${cat.cat_id}`;
        console.log(user.role);
        console.log(cat.owner);
        if (user.role === "admin") {
          modForm.querySelector("select").style.display = "block";
          modForm.querySelector("select").value = cat.owner;
        } else {
          modForm.querySelector("select").style.display = "none";
        }
      });

      const delButton = document.createElement("button");
      delButton.innerHTML = "Delete";
      delButton.addEventListener("click", async () => {
        const fetchOptions = {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        };
        try {
          const response = await fetch(
            url + "/cats/" + cat.cat_id,
            fetchOptions,
          );
          const json = await response.json();
          console.log("delete response", json);
          getCat();
        } catch (e) {
          console.log(e.message());
        }
      });
      li.appendChild(modButton);
      li.appendChild(delButton);
    }
  });
};

close.addEventListener("click", (evt) => {
  evt.preventDefault();
  imageModal.classList.toggle("hide");
});


const getCat = async () => {
  console.log("getCat token ", sessionStorage.getItem("token"));
  try {
    const options = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(url + "/cats", options);
    const cats = await response.json();
    console.log(cats);
    createCatCards(cats);
  } catch (e) {
    console.log(e.message);
  }
};

const createUserOptions = (users) => {
  userList.innerHTML = "";
  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.user_id;
    option.innerHTML = user.name;
    option.classList.add("light-border");
    userList.appendChild(option);
  });
};

const getUsers = async () => {
  try {
    const options = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(url + "/users", options);
    const users = await response.json();
    createUserOptions(users);
  } catch (e) {
    console.log(e.message);
  }
};

addForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  const fd = new FormData(addForm);
  const fetchOptions = {
    method: "POST",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    },
    body: fd,
  };
  const response = await fetch(url + "/cats", fetchOptions);
  const json = await response.json();
  console.log("add response", json);
  getCat();
});

modForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  const data = serializeJson(modForm);
  const fetchOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    },
    body: JSON.stringify(data),
  };

  console.log(fetchOptions);
  const response = await fetch(modForm.action, fetchOptions);
  const json = await response.json();
  console.log("modify response", json);
  getCat();
});

loginForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  const data = serializeJson(loginForm);
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(url + "/auth/login", fetchOptions);
  const json = await response.json();
  if (!json.user) {
    alert(json.error.message);
  } else {
    sessionStorage.setItem("token", json.token);
    sessionStorage.setItem("user", JSON.stringify(json.user));
    user = JSON.parse(sessionStorage.getItem("user"));
    startApp(true);
  }
});

logOut.addEventListener("click", async (evt) => {
  evt.preventDefault();
  try {
    const options = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(url + "/auth/logout", options);
    const json = await response.json();
    console.log(json);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    alert("You have logged out");
    startApp(false);
  } catch (e) {
    console.log(e.message);
  }
});

addUserForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  const data = serializeJson(addUserForm);
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const response = await fetch(url + "/auth/register", fetchOptions);
  const json = await response.json();
  if (json.error) {
    alert(json.error.message);
  } else {
    alert(json.message);
  }
});

(async () => {
  if (sessionStorage.getItem("token") && sessionStorage.getItem("user")) {
    try {
      const fetchOptions = {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      };
      const response = await fetch(url + "/auth/me", fetchOptions);
      if (!response.ok) {
        startApp(false);
      } else {
        startApp(true);
      }
    } catch (e) {
      console.log(e.message);
    }
  } else {
    startApp(false);
  }
})();
