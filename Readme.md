# X.com Scroll Saver

X.com Scroll Saver is a Chrome extension that helps you save your position in the X.com (formerly Twitter) timeline and easily return to the last tweet you've seen.

## Features

- Automatically saves your position as you scroll through your timeline
- Adds "Save" buttons to individual tweets for manual saving
- Provides a floating "Go to Saved Tweet" button to quickly navigate to your last saved position
- Works on both x.com and twitter.com domains
- Intelligently handles old saved tweets and provides warnings for tweets older than 15 days
- Only works in the "Following" tab to ensure a consistent user experience

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the directory containing the extension files

## Usage

1. Navigate to X.com (or Twitter.com) and log in to your account
2. The extension will automatically start working in the "Following" tab
3. As you scroll, the extension will automatically save your position
4. To manually save a tweet's position, click the "Save" button that appears on each tweet
5. To return to your last saved position, click the "Go to Saved Tweet" button that appears in the top right corner of the page
6. If you want to cancel the scrolling process, click the "Cancel Scrolling" button that appears during navigation

## Files

- `manifest.json`: The extension's manifest file
- `content.js`: The main JavaScript file containing the extension's functionality
- `styles.css`: CSS styles for the extension's UI elements
- `icon.png`: The extension's icon

## How it works

The extension uses a content script (`content.js`) that runs on X.com and Twitter.com. It performs the following main functions:

1. Extracts tweet IDs
2. Adds "Save" buttons to tweets
3. Creates floating buttons for navigation
4. Implements smooth scrolling to find saved tweets
5. Automatically saves the last visible tweet while scrolling
6. Checks if the user is in the "Following" tab

## Styling

The extension uses custom CSS to style the buttons and ensure they match the X.com design. It imports the Inter font and defines styles for the save buttons and floating navigation buttons.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Disclaimer

This extension is not affiliated with, endorsed by, or sponsored by X.com (formerly Twitter). Use it at your own risk and in compliance with X.com's terms of service.
