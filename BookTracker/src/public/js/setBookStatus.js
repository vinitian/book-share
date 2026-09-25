async function setBookStatus(id) {
  const newStatus = document.querySelector(
    `.book-card[data-book-id="${id}"] .actions .status-selector select`,
  ).value;
  const button = document.querySelector(
    `.book-card[data-book-id="${id}"] .actions .status-selector button`,
  );

  const response = await fetch("/set-status", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, newStatus }),
  });

  if (!response.ok) {
    throw new Error("Failed to set book status");
  }

  button.textContent = "Status set!";
  return response.json();
}
