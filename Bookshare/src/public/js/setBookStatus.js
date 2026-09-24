async function setBookStatus(id) {
  const newStatus = document.querySelector(
    `.status[data-book-id="${id}"]`,
  ).value;
  console.log("NEW STATUS", newStatus, "|", id);
  const response = await fetch("/set-status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, newStatus }),
  });

  if (!response.ok) {
    throw new Error("Failed to set book status");
  }

  return response.json();
}
