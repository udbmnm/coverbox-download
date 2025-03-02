# 🎵 CoverBox Downloader

CoverBox Downloader is a Chrome extension that helps you easily download album cover images from the CoverBox website. This extension provides a simple and intuitive interface for batch downloading high-quality album covers.

> **✨ Special Note:** This project was entirely developed by AI using Cursor, without a single line of code manually written by humans. It serves as a demonstration of AI-assisted development.

## 🚀 Features

- 🖱️ One-click access to the CoverBox website
- 🔍 Automatic detection of album covers on the page
- 📁 Customizable save directory
- 📥 Batch download of high-resolution images (3000x3000)
- 📊 Real-time download progress display
- 🖐️ Draggable control panel

## 📥 Installation

### From Chrome Web Store

*Coming soon* 🔜

### Manual Installation (Developer Mode)

1. Download or clone this repository to your local machine
   ```
   git clone https://github.com/udbmnm/coverbox-download.git
   ```

2. Open Chrome browser and navigate to: `chrome://extensions/`

3. Enable "Developer mode" in the top-right corner

4. Click "Load unpacked" button

5. Select the folder you just downloaded

6. After installation, you'll see the extension icon in your Chrome toolbar

## 🎮 How to Use

1. Click on the CoverBox Downloader icon in the Chrome toolbar to automatically open the CoverBox website

2. Search for the album covers you want on the CoverBox website

3. Once search results appear, in the control panel in the top-right corner:
   - Set the save directory (default is "CoverBox")
   - Click the "Start Download" button

4. The extension will automatically retrieve all album covers on the page and start downloading high-resolution versions
   - Download progress will be displayed in real-time on the control panel
   - All images will be saved in the specified folder within your default download directory

## ⚙️ Silent Download Settings

To avoid save dialog popups for each download, you can modify Chrome's download settings:

1. Open `chrome://settings/downloads`
2. Turn off the "Ask where to save each file before downloading" option

## 📂 Project Structure

```
coverbox-downloader/
├── manifest.json        # Extension configuration file
├── background.js        # Background script
├── content.js           # Content script
├── panel.css            # Control panel styles
└── images/              # Extension icons
    ├── 16.png
    ├── 48.png
    └── 128.png
```

## 💻 Technical Details

- Uses Chrome extension API for browser integration
- Injects control panel into webpage using content scripts
- Implements batch downloading with Chrome downloads API
- Saves user settings with Chrome storage API

## 🔒 Privacy Statement

This extension does not collect any user data. It only runs when you visit the CoverBox website and only downloads images you can see on that site.

## 📜 License

MIT

## 👥 Contributions

Issues and suggestions for improvements are welcome! If you want to contribute code, please create an issue first to discuss what you would like to change.

## 📧 Contact

For any questions or suggestions, please contact me through GitHub issues.

---

We hope CoverBox Downloader makes your life easier! Thanks for using it! 🙏