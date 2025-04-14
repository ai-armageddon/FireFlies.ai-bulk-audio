const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.FIREFLIES_API_KEY;
const subscription = process.env.FIREFLIES_SUBSCRIPTION;
const audioFilesDir = './audio-files';

if (!apiKey) {
  console.error("API Key is missing. Please check your .env file.");
  process.exit(1);
}

const allAudio = [
  // format
  // { title: "Title of the audio", url: "https://audio.com/url-of-audio" }
];

const url = "https://api.fireflies.ai/graphql";
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${apiKey}`,
};

// Upload audio to Fireflies.ai
async function uploadAudio(title, audio_url) {
  const encodedAudioUrl = encodeURI(audio_url);

  const input = {
	url: encodedAudioUrl,
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
	query: `mutation($input: AudioUploadInput) {
	  uploadAudio(input: $input) {
		success
		title
		message
	  }
	}`,
	variables: { input },
  };

  try {
	const response = await axios.post(url, data, { headers: headers });
	console.log("Response:", JSON.stringify(response.data));
  } catch (error) {
	console.error("Error:", error?.response?.data?.errors || error.message || "Unknown error");
  }
}

// delay upload to Fireflies.ai based
// on subscription tier rate limits
async function uploadAudioWithDelay() {
  let delay;

  switch (subscription) {
	case "Free":
	case "Pro":
	  delay = (1000 * 60 * 60 * 24) / 50;
	  break;
	case "Business":
	case "Enterprise":
	  delay = 1000 * 1;
	  break;
	default:
	  console.warn("Unsupported subscription tier. Defaulting to Free tier limits.");
	  delay = (1000 * 60 * 60 * 24) / 50;
  }

  for (const audio of allAudio) {
	await uploadAudio(audio.title, audio.url);
	await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

// Upload all audio files from a local ./audio-files dir
async function uploadLocalAudioFiles() {
  const completedDirPath = path.join(audioFilesDir, 'completed');
  if (!fs.existsSync(completedDirPath)) {
	fs.mkdirSync(completedDirPath, { recursive: true });
  }

  fs.readdir(audioFilesDir, async (err, files) => {
	if (err) {
	  console.error(`Error reading the directory: ${err}`);
	  return;
	}

	// Filter valid audio files
	const validFiles = files.filter(file => {
	  const filePath = path.join(audioFilesDir, file);
	  if (fs.statSync(filePath).isDirectory()) return false;

	  const fileStat = fs.statSync(filePath);
	  const fileSizeInMB = fileStat.size / (1024 * 1024);
	  const fileExtension = path.extname(file);

	  if (!['.mp3', '.wav'].includes(fileExtension)) {
		console.log(`${file} is not a valid audio format.`);
		return false;
	  }

	  if (fileSizeInMB > 200) {
		console.log(`${file} is larger than 200MB and will not be uploaded.`);
		return false;
	  }

	  return true;
	});

	// Calculate delay based on subscription tier
	let delay;
	switch (subscription) {
	  case "Free":
	  case "Pro":
		delay = (1000 * 60 * 60 * 24) / 50;
		break;
	  case "Business":
	  case "Enterprise":
		delay = 1000 * 1;
		break;
	  default:
		console.warn("Unsupported subscription tier. Defaulting to Free tier limits.");
		delay = (1000 * 60 * 60 * 24) / 50;
	}

	console.log(`Processing ${validFiles.length} audio files with a ${delay}ms delay between uploads...`);

	// Process files sequentially with delay
	for (const file of validFiles) {
	  const filePath = path.join(audioFilesDir, file);

	  try {
		const audioUrl = await convertFileToURL(filePath);
		await uploadAudio(file, audioUrl);

		const destinationPath = path.join(completedDirPath, file);
		fs.rename(filePath, destinationPath, (err) => {
		  if (err) {
			console.error(`Error moving file: ${err}`);
			return;
		  }
		  console.log(`File moved to ${destinationPath}`);
		});

		// Apply rate limiting delay
		if (validFiles.indexOf(file) < validFiles.length - 1) {
		  console.log(`Waiting ${delay}ms before next upload...`);
		  await new Promise((resolve) => setTimeout(resolve, delay));
		}
	  } catch (error) {
		console.error(`Error processing file ${file}:`, error);
	  }
	}
  });
}

async function convertFileToURL(filePath) {
  // This is a placeholder function that should be replaced with actual implementation
  // Options include:
  // 1. Setting up a local server to serve the files
  // 2. Uploading to a file hosting service and getting a URL
  // 3. Using a pre-signed URL from a cloud storage provider

  console.warn('WARNING: convertFileToURL is using a placeholder URL. This will not work for actual transcription.');
  console.warn('Please implement proper file URL conversion based on your requirements.');

  // For now, return a placeholder URL that won't actually work
  return `https://example.com/${path.basename(filePath)}`;
}

// For testing, we'll just try one URL upload
console.log("Starting test upload with the first URL in allAudio array...");
if (allAudio.length > 0) {
  uploadAudio(allAudio[0].title, allAudio[0].url)
    .then(() => console.log("Test upload completed."))
    .catch(err => console.error("Test upload failed:", err));
} else {
  console.log("No audio URLs defined in allAudio array.");
}

// Comment out these lines for now
// uploadAudioWithDelay();
// uploadLocalAudioFiles();