const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const response = await fetch("/add", {
    method: "POST",
    body: new FormData(form),
  });

  if (!response.ok) {
    throw new Error("Failed to add book");
  }
  const book = await response.json();

  const message = document.createElement("p");
  message.textContent = "Book added!";
  form.append(message);
});
