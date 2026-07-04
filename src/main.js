import "./style.css";

const form = document.querySelector("#form");
const input = document.querySelector("#text");
const list = document.querySelector("#list");

async function api(path, options) {
  const res = await fetch(`/api${path}`, {
    headers: { "content-type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function load() {
  const todos = await api("/todos");
  list.innerHTML = "";
  for (const todo of todos) {
    const item = document.createElement("li");
    item.innerHTML = `<label><input type="checkbox" ${todo.done ? "checked" : ""}> <span></span></label><button>Delete</button>`;
    item.querySelector("span").textContent = todo.text;
    item.querySelector("input").onchange = (e) => api(`/todos/${todo.id}`, { method: "PUT", body: JSON.stringify({ done: e.target.checked }) }).then(load);
    item.querySelector("button").onclick = () => api(`/todos/${todo.id}`, { method: "DELETE" }).then(load);
    list.append(item);
  }
}

form.onsubmit = async (e) => {
  e.preventDefault();
  if (!input.value.trim()) return;
  await api("/todos", { method: "POST", body: JSON.stringify({ text: input.value.trim() }) });
  input.value = "";
  await load();
};

load().catch((err) => {
  list.innerHTML = `<li>${err.message}</li>`;
});
