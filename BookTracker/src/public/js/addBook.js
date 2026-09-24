const form = document.querySelector("form");
const titleInput = form.querySelector(".title input");
const authorInput = form.querySelector(".author input");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = titleInput.value;
  const author = authorInput.value;

  const response = await fetch("/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, author }),
  });

  if (!response.ok) {
    throw new Error("Failed to add book");
  }

  const message = document.querySelector("#book-added-text");
  message.textContent = "Book added!";
});
