# RedNote Scraper Pro (Simulation)

A professional-grade dashboard simulation for batch crawling RedNote (Xiaohongshu) data based on keywords. This application demonstrates the logic, scheduling, and anti-ban mechanisms of a web scraper, utilizing Google Gemini AI to generate realistic sample data for demonstration purposes without triggering platform security mechanisms.

## ✨ Key Features

### 1. 🤖 Automated Batch Scraping
- **Keyword Management**: Input lists of up to 50+ keywords (one per line).
- **Configurable Batch Size**: Define how many requests to process per batch.
- **Items Per Keyword**: Configurable depth control (e.g., set to **50** to simulate capturing the top 50 posts per keyword).

### 2. ⏱️ Intelligent Scheduling
- **Automated Intervals**: Set the scraper to run every `N` hours (Default: 1 hour).
- **Visual Timer**: Displays the countdown to the next execution batch.
- **State Management**: Supports Start, Stop, and Pause states with graceful abort handling.

### 3. 🛡️ Anti-Ban Simulation (Risk Control)
To mimic real-world scraping challenges, the app includes configurable safety measures:
- **Randomized Delays**: Set minimum and maximum wait times between requests (e.g., 1000ms - 3000ms).
- **Proxy Rotation**: Toggle logic to simulate rotating residential IPs.
- **User-Agent Rotation**: Toggle logic to simulate different browser fingerprints.

### 4. 📊 Data Visualization & Export
- **Real-time Table**: View captured data including Title, Content, Author, Likes, Comments, and Date.
- **Auto-Sorting**: Data is automatically sorted by date (newest first), ensuring you always see the latest posts.
- **Excel/CSV Export**: One-click export of all collected data to `.csv` format (compatible with Excel).

### 5. 📝 Operation Logs
- **Live Console**: Real-time logging of scraper actions (Starting batch, processing keyword, success/error status).
- **Visual Status**: Color-coded logs for easy monitoring.

## 🚀 Getting Started

### Prerequisites
- Node.js installed.
- A valid **Google Gemini API Key**.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/rednote-scraper-pro.git
   cd rednote-scraper-pro
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set up API Key**
   Create a `.env` file in the root and add your key:
   ```env
   API_KEY=your_gemini_api_key_here
   ```

4. **Run the Application**
   ```bash
   npm start
   ```

## 📖 Usage Guide: Manual Simulation Workflow

To replicate the specific manual workflow requested:

1.  **Input Keywords**:
    *   In the left sidebar sidebar, paste your **50 groups of keywords** (one keyword per line).
2.  **Configure Settings**:
    *   Set **Interval** to `1` (Run every 1 hour).
    *   Set **Items / Key** to `50`. This ensures the system simulates fetching the latest 50 articles for each keyword.
    *   Set **Max Requests / Batch** to `2500`.
    *   Enable **Anti-Ban Measures** (Randomize User-Agent & Proxies).
3.  **Start Task**:
    *   Click the **Start Task Loop** button.
4.  **Monitor Execution**:
    *   Watch the Logs Panel. The system will process keywords one by one with random delays to simulate human behavior.
    *   Observe the "Captured Data" table filling up. The rows are automatically **sorted by Date** (Newest first).
5.  **Export Results**:
    *   Once the batch is complete, click the **Export Excel/CSV** button to download the data for analysis.

## ⚠️ Disclaimer
This application is a **simulation**. It does not actually scrape `xiaohongshu.com` directly, as client-side scraping is restricted by CORS and security policies. Instead, it uses AI (Gemini) to generate realistic data structures that match the platform's format, allowing developers to test UI, scheduling logic, and data handling pipelines safely.