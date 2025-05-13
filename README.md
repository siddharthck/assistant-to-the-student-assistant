<div align="center">
  <img src="./assets/icons/logo-128.png" alt="Assistant to the Assistant Logo" />
  <h1>Assistant to the Assistant</h1>
</div>

# Overview
The "Assistant to the Assistant" Chrome extension is designed to simplify event management for SJSU library media services student assistants. By providing an intuitive dashboard and seamless integration with LibCal, this tool helps users efficiently manage their shifts, rooms, and event details.

## Problem Statement
Managing events and room bookings can be a tedious and error-prone process for student assistants. The existing workflow involves manually navigating through LibCal, filtering events, and cross-referencing room details. This process is time-consuming and lacks a centralized view tailored to the assistant's specific needs.

## Solution
"Assistant to the Assistant" addresses these challenges by:
- Providing a personalized dashboard that displays events filtered by the user's shifts and rooms of concern.
- Fetching event data directly from LibCal using authenticated API requests.
- Mapping events to rooms and enriching them with detailed metadata.
- Offering a user-friendly interface to streamline event management tasks.

## Features
- **Landing Page**: Configure user settings, including name, email, shifts, and rooms of concern.
- **Dashboard**: View and manage events in an intuitive tile-based layout.
- **Event Filtering**: Automatically filter events based on shift timings and room assignments.
- **Event Details**: Fetch and display detailed event metadata, including internal notes and media requirements.
- **Authentication**: Securely fetch data from LibCal using session cookies.

## Installation
1. Clone this repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd assistant-to-the-assistant
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the project:
   ```bash
   npm run build
   ```
5. Load the extension in Chrome:
   - Open `chrome://extensions/`.
   - Enable **Developer mode**.
   - Click **Load unpacked** and select the project directory.

## Usage
1. Open the extension popup and configure your settings on the landing page.
2. Navigate to the dashboard to view and manage events for your shifts.
3. Use the intuitive interface to access detailed event information and manage bookings.

## Technologies Used
- **React**: For building the user interface.
- **Webpack**: For bundling the extension.
- **Chrome Extensions API**: For integrating with the browser.
- **LibCal API**: For fetching event data.

## File Structure
- `background.js`: Handles background tasks and message passing.
- `content.js`: Injected into LibCal pages to fetch data.
- `dashboard/`: Contains the React components for the dashboard.
- `popup/`: Contains the HTML, CSS, and JS for the extension popup.
- `utils/`: Utility functions for API requests, parsing, and storage.
- `rooms.json`: Configuration file for room mappings.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
