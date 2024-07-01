const axios = require("axios");
require("dotenv").config();

const apiKey = process.env.FIREFLIES_API_KEY;
const subscription = process.env.FIREFLIES_SUBSCRIPTION; // Assuming you have a way to identify the user's subscription tier

if (!apiKey) {
  console.error("API Key is missing. Please check your .env file.");
  process.exit(1);
}

const allAudio = [
  // format
  // { title: "audio title", url: "audio url" },

  // example
  // { title: "Meeting with John", url: "https://example.com/audio1.mp3" },

  // add audio titles and URLs to files below
];

const url = "https://api.fireflies.ai/graphql";
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${apiKey}`,
};

async function uploadAudio(title, audio_url) {
  // Encoding the URL to handle spaces
  const encodedAudioUrl = encodeURI(audio_url);

  const input = {
    url: encodedAudioUrl, // Use the encoded URL
    title: title,
    attendees: [
      {
        displayName: process.env.FIREFLIES_DISPLAY_NAME || "Anon",
        email: process.env.FIREFLIES_EMAIL || "",
        phoneNumber: process.env.FIREFLIES_PHONE || "",
      },
    ],
  };
  const data = {
    query: `       
    mutation($input: AudioUploadInput) {
          uploadAudio(input: $input) {
            success
            title
            message
          }
        }
      `,
    variables: { input },
  };

  try {
    const response = await axios.post(url, data, { headers: headers });
    console.log("Response:", JSON.stringify(response.data));
  } catch (error) {
    console.error("Error:", error?.response?.data?.errors || error.message || "Unknown error");
  }
}

async function uploadAudioWithDelay() {
  let delay;

  switch (subscription) {
    case "Free":
    case "Pro":
      delay = (1000 * 60 * 60 * 24) / 50; // 50 requests per day / 1 request per 28.8 minutes
      break;
    case "Business":
    case "Enterprise":
      delay = 1000 * 1; // 60 requests per minute translates to 1 request per second
      break;
    default:
      console.warn("Unsupported subscription tier. Defaulting to Free tier limits.");
      delay = (1000 * 60 * 60 * 24) / 50; // for 50 requests per day
  }

  for (const audio of allAudio) {
    await uploadAudio(audio.title, audio.url);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

uploadAudioWithDelay();
