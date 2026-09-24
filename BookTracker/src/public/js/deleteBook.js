async function deleteBook(id) {
  const bookcard = document.querySelector(`.book-card[data-book-id="${id}"]`);
  const deleteButton = bookcard.querySelector(".delete");

  deleteButton.textContent = "Deleting...";

  const response = await fetch("/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    deleteButton.textContent = "Deletion failed";
    throw new Error("Failed to delete book");
  }

  bookcard.remove();
  return response.json();
}
