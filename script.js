const form = document.getElementById("queueForm");
const nameInput = document.getElementById("name");
const waitingList = document.getElementById("waitingList");
const nowServing = document.getElementById("nowServing");
const queueProgress = document.getElementById("queueProgress");
const queuePositionText = document.getElementById("queuePositionText");
const nextBtn = document.getElementById("nextBtn");

let queue = [];
let current = null;
let userQueueNumber = null;
let userName = null;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  if (name) {
    queue.push(name);
    if (!userName) {
      userName = name;
      userQueueNumber = queue.length; // assigned queue number
      alert(`Hi ${name}, your queue number is #${userQueueNumber}`);
    }
    updateUI();
    nameInput.value = "";
  }
});

// Staff moves to next patient manually
nextBtn.addEventListener("click", () => {
  if (queue.length > 0) {
    current = queue.shift();
  } else {
    current = null;
  }
  updateUI();
});

function updateUI() {
  nowServing.textContent = current || "No one yet";

  // Always animate "Now Serving"
  if (current) {
    nowServing.classList.add(
      "animate-pulse",
      "text-green-700",
      "bg-green-100",
      "shadow-lg",
      "shadow-green-400/50",
      "rounded-lg",
      "px-4",
      "py-2",
      "inline-block"
    );
  } else {
    nowServing.classList.remove(
      "animate-pulse",
      "text-green-700",
      "bg-green-100",
      "shadow-lg",
      "shadow-green-400/50",
      "rounded-lg",
      "px-4",
      "py-2",
      "inline-block"
    );
  }

  // Animate all patients in waiting list
  waitingList.innerHTML = queue
    .map((person, index) => {
      const isUser = person === userName;
      const isCurrent = person === current;

      return `
        <li class="px-3 py-2 rounded-lg animate-pulse ${
          isUser
            ? isCurrent
              ? "bg-green-100 text-green-700 font-bold border-2 border-green-400 shadow-md shadow-green-300/40"
              : "bg-blue-50 text-blue-700 font-semibold border-2 border-blue-400 shadow-md shadow-blue-300/40"
            : "bg-gray-100 text-gray-700 shadow"
        } text-sm sm:text-base">
          ${index + 1}. ${person} 
          ${
            isUser
              ? isCurrent
                ? " ✅ It's your turn!"
                : " ⏳ (your spot)"
              : ""
          }
        </li>`;
    })
    .join("");

  if (queue.length > 0 || current) {
    let position = queue.indexOf(userName) + 1;
    if (position > 0) {
      let progress = ((queue.length - position + 1) / queue.length) * 100;
      queueProgress.style.width = `${progress}%`;
      queuePositionText.textContent = `You are #${position} in queue (${
        queue.length - position
      } ahead of you)`;
    } else if (current === userName) {
      queueProgress.style.width = "100%";
      queuePositionText.textContent = "It's your turn ✅";
    } else if (!queue.includes(userName) && current !== userName && userName) {
      queueProgress.style.width = "100%";
      queuePositionText.textContent = "You have been served ✅";
    }
  } else {
    queueProgress.style.width = "0%";
    queuePositionText.textContent = "No one in queue";
  }
}
