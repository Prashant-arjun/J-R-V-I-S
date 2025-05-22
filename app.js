const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

let userName = "Sir";
let speakEnabled = true;
let isListening = true;

function speak(text) {
    if (!speakEnabled) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.volume = 1;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);

    // Update only JARVIS's part of the screen text
    if (content.innerHTML.includes("JARVIS:")) {
        content.innerHTML = content.innerHTML.replace(/JARVIS:.*$/, `JARVIS: ${text}`);
    } else {
        content.innerHTML += `<br><b>JARVIS:</b> ${text}`;
    }
}

function wishMe() {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 12) speak("Good Morning " + userName);
    else if (hour >= 12 && hour < 17) speak("Good Afternoon " + userName);
    else speak("Good Evening " + userName);
}

window.addEventListener('load', () => {
    speak("Initializing JARVIS...");
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    if (!isListening) return;
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    
    content.innerHTML = `<b>You:</b> ${transcript}<br><b>JARVIS:</b> Thinking...`;
    takeCommand(transcript.toLowerCase());
}

btn.addEventListener('click', () => {
    if (isListening) {
        content.textContent = "Listening....";
        recognition.start();
    } else {
        content.textContent = "JARVIS is shut down.";
    }
});

function takeCommand(message) {
    // Greet
    if (message.includes("hello") || message.includes("hey")) {
        speak(`Hello ${userName}, how can I help you today?`);
    }

    // Name memory
    else if (message.includes("my name is")) {
        userName = message.split("my name is")[1].trim();
        speak(`Nice to meet you, ${userName}`);
    }

    // Time and Date
    else if (message.includes("time")) {
        const time = new Date().toLocaleTimeString();
        speak("The current time is " + time);
    } else if (message.includes("date")) {
        const date = new Date().toLocaleDateString();
        speak("Today's date is " + date);
    }

    // Web actions
    else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening YouTube...");
    } else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...");
    }

    // Wikipedia
    else if (message.includes("wikipedia")) {
        const query = message.replace("wikipedia", "").trim();
        window.open(`https://en.wikipedia.org/wiki/${query}`, "_blank");
        speak(`Searching Wikipedia for ${query}`);
    }

    // Google search
    else if (message.includes("what is") || message.includes("who is") || message.includes("what are")) {
        window.open(`https://www.google.com/search?q=${message.replace(/ /g, "+")}`, "_blank");
        speak("Here’s what I found on Google for " + message);
    }

    // Weather
    else if (message.includes("weather")) {
        window.open(`https://www.google.com/search?q=weather+today`, "_blank");
        speak("Showing you the weather forecast.");
    }

    // Jokes
    else if (message.includes("joke")) {
        const jokes = [
            "Why don't scientists trust atoms? Because they make up everything.",
            "What do you call a fake noodle? An impasta.",
            "Why did the web developer go broke? Because he used up all his cache.",
            "Why do JavaScript devs wear glasses? Because they don't C sharp."
        ];
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        speak(randomJoke);
    }

    // Voice mute/unmute
    else if (message.includes("mute")) {
        speakEnabled = false;
        content.innerHTML += `<br><b>JARVIS:</b> Voice muted.`;
    } else if (message.includes("unmute")) {
        speakEnabled = true;
        speak("Voice unmuted.");
    }

    // Shutdown JARVIS
    else if (message.includes("shutdown") || message.includes("bye")) {
        speak("Shutting down. Have a great day!");
        isListening = false;
    }

    // Help
    else if (message.includes("help")) {
        speak("I can tell time and date, open websites, search on Google or Wikipedia, show the weather, tell jokes, and remember your name. Just say the command.");
    }

    // Default fallback
    else {
        window.open(`https://www.google.com/search?q=${message.replace(/ /g, "+")}`, "_blank");
        speak("Here's what I found on Google for " + message);
    }
}
