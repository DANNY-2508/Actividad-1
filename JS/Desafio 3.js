const input = document.querySelector("input");
const button = document.querySelector("button");
const ul = document.querySelector("ul");

button.addEventListener("click", function () {
	if (input.value.length > 0) {
		const li = document.createElement("li");
		const task = document.createElement("span");
		const deleteButton = document.createElement("button");

		task.textContent = input.value;
		deleteButton.textContent = "Eliminar";

		li.appendChild(task);
		li.appendChild(deleteButton);
		ul.appendChild(li);

		input.value = "";
	}
});

ul.addEventListener("click", function (event) {
	const target = event.target;
	if (target.tagName === "SPAN") {
		target.classList.toggle("completed");
	}
	if (target.tagName === "BUTTON") {
		target.parentNode.remove();
	}
});
