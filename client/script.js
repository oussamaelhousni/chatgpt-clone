import bot from "./assets/bot.svg";
import user from "./assets/user.svg";
const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");
let loadInterval;
console.log(form);

const loader = (element) => {
    element.textContent = "";
    loadInterval = setInterval(() => {
        element.textContent += ".";
        if (element.textContent === "....") element.textContent = "";
    }, 300);
};

const typeText = (element, text) => {
    element.innerHTML = "";
    let index = 0;
    const intervalId = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
        } else {
            clearInterval(intervalId);
        }
    }, 20);
};

const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexaDecimalString = randomNumber.toString(16);
    return `id-${timestamp}-${hexaDecimalString}`;
};

const createStripe = (isAi, value, uniqueId) => {
    const stripeHtml = `
		<div class="wrapper ${isAi && "ai"}">
			<div class="chat">
				<div class="profile">
					<img src=${isAi ? bot : user} alt="${isAi ? "bot" : "user"}"/>
				</div>
				<div class="message" id="${uniqueId}">${value}</div>
			</div>
		</div>
	`;
    return stripeHtml;
};

const handleSubmit = async (e) => {
    e.preventDefault();

    // create user's stripe
    const formData = new FormData(form);
    if (!formData.get("prompt")) return;
    const message = formData.get("prompt");
    chatContainer.innerHTML += createStripe(false, message);

    // create ai's stripe
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += createStripe(true, " ", uniqueId);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    const messageDiv = document.getElementById(uniqueId);
    loader(messageDiv);
    form.reset();

    // fetch data from the server
    const response = await fetch("http://localhost:5000", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: message, message: "hhello" }),
    });

    clearInterval(loadInterval);
    messageDiv.innerHTML = "";
    if (response.ok) {
        const data = await data.json();
        const botResponse = data.bot.trim();
        typeText(messageDiv, botResponse);
    } else {
        const errorText = await response.text();
        messageDiv.innerHTML = "Something went wrong !";
        alert(errorText);
    }
};

form.addEventListener("submit", handleSubmit);
