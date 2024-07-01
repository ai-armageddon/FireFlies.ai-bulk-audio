# FireFlies.ai Bulk Audio Uploader

This Node.js script allows you to bulk upload audio files to FireFlies.ai for transcription.

The script reads a list of audio files with their titles and URLs, and uploads each file to FireFlies.ai with a specified delay between uploads to avoid rate limiting.

## Prerequisites

– Unix based system (Linux, macOS, etc.)
- Node.js installed on your machine.
- A FireFlies.ai account with an API key.

## Installation

1. Clone the repository:

   ```bash or zsh
   git clone https://github.com/yourusername/fireflies-bulk-audio-uploader.git
   cd fireflies-bulk-audio-uploader
   ```

2. Install the dependencies:

   ```bash or zsh
   npm install
   ```

3. Edit the `.env` file and add your FireFlies.ai API key:

   ```
   FIREFLIES_API_KEY=your_api_key_here
   ```
See the [FireFlies.ai Docs](https://docs.fireflies.ai/getting-started/quickstart) for more information on how to obtain an API key.

## Usage

1. Modify the `allAudio` array in the script with your audio files' titles and URLs.

2. Run the script:

   ```bash
   node ./uploadAudio.js
   ```

## Configuration

Subscription Handling

- **Delay Between Uploads**: The script includes a delay between uploads to avoid rate limiting based on your FireFlies.ai subscription tier.

![FireFlies.AI rate limits table.](./rate-limit.png)

Ensure you have the necessary environment variables set up in your .env file for your subscription tier.

```bash
FIREFLIES_SUBSCRIPTION=your_subscription_tier # options: 'Free', 'Pro', 'Business', 'Enterprise'
```

## Example

Here is an example of the `allAudio` array format:

```javascript
const allAudio = [
  { title: "Example Title 1", url: "https://example.com/audio1.mp3" },
  { title: "Example Title 2", url: "https://example.com/audio2.mp3" },
  // Add more audio files as needed
];
```

## Notes

- The script uses the FireFlies.ai GraphQL API to upload audio files.
- Ensure that the audio URLs are correctly formatted and accessible.
- Handle any potential errors during the upload process by checking the console logs.

## Support

For feature requests, questions, or feedback, please reach out to me via email at [jer.boulerice@gmail.com](mailto:jer.boulerice@gmail.com).

––

If you'd like to have videos converted to audio, files hosted and/or the process handled, feel free to reach out to me at the email above.

## Potential Future Features feel free to submit pull requests for these features
- [ ] Add support for uploading audio files from a local directory.
- [ ] Add support for uploading audio files from a Google Drive folder.
- [ ] Add support for uploading audio files from a Dropbox folder.
- [ ] Add support for uploading audio files from an AWS S3 bucket.
- [ ] Add support for uploading audio files from a Microsoft OneDrive folder.

–

- [ ] Handle max upload file sizes.
- [ ] Handle max upload file durations.

–

- [ ] Add support for converting videos to audio files before uploading.
- [ ] Add support for YouTube video URLs to be converted to audio files before uploading.
- [ ] Add support for Vimeo video URLs to be converted to audio files before uploading.

–

- [ ] Add support for Twitter/X.com video URLs to be converted to audio files before uploading.
- [ ] Add support for Instagram video URLs to be converted to audio files before uploading.
- [ ] Add support for TikTok video URLs to be converted to audio files before uploading.

–

- [ ] build CLI for tool
- [ ] build GUI for tool
- [ ] add out-of-the-box Windows support

Email me if interested in a particular feature or submit a pull request for contributions.
