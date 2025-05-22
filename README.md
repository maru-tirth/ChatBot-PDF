# Simple PDF Chatbot - Complete Beginner Guide

## What This Does

This chatbot lets you:

1. Upload a PDF file

2. Ask questions about what's in the PDF

3. Get answers from Claude AI based only on your document

## Step-by-Step Setup

### 1. Get Your Computer Ready

First, you need Node.js installed:

- Go to https://nodejs.org/

- Download and install the LTS version

- This gives you the tools to run JavaScript on your computer

### 2. Get Your API Key

You need a key to talk to Claude AI:

- Go to https://console.anthropic.com/

- Create a free account

- Go to "API Keys" section

- Click "Create Key"

- Copy the key (it looks like: `sk-ant-api03-...`)

### 3. Create Your Project

Open your terminal/command prompt and type:

```bash

# Create a new folder

mkdir  my-pdf-chatbot

cd  my-pdf-chatbot

# Create the files you need

mkdir  public

mkdir  uploads

```

### 4. Save the Files

Save each code file in your project folder:

1. **app.js** - The main server code (from the first artifact)

2. **package.json** - Lists what tools you need (from second artifact)

3. **public/index.html** - The website interface (from third artifact)

4. **.env** - Your secret API key (from fourth artifact)

Your folder should look like:

```

my-pdf-chatbot/

├── app.js

├── package.json

├── .env

├── public/

│ └── index.html

└── uploads/

```

### 5. Add Your API Key

Open the `.env` file and replace `your_api_key_here` with your real API key:

```

ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here

```

### 6. Install the Tools

In your terminal, run:

```bash

npm  install

```

This downloads all the tools your chatbot needs.

### 7. Start Your Chatbot

Run this command:

```bash

npm  start

```

You should see:

```

🚀 PDF Chatbot is running!

📍 Open your browser and go to: http://localhost:3000

```

### 8. Use Your Chatbot

1. Open your web browser

2. Go to: http://localhost:3000

3. Upload a PDF file

4. Ask questions about it!

## How It Works (Simple Explanation)

### The Server (app.js)

Think of this as a helpful assistant that:

- Receives your PDF file

- Reads all the text from it

- Stores the text in memory

- When you ask questions, sends the text + question to Claude AI

- Returns Claude's answer to you

### The Website (index.html)

This is the interface you see:

- Has buttons to upload files

- Has a text box to type questions

- Shows the conversation between you and the AI

### Key Parts Explained

**File Upload:**

```javascript

// When someone uploads a file:

// 1. Check if it's a PDF

// 2. Read all the text from it

// 3. Save the text in memory

// 4. Tell the user "success!"

```

**Asking Questions:**

```javascript

// When someone asks a question:

// 1. Take their question

// 2. Take the PDF text we saved

// 3. Send both to Claude AI

// 4. Claude reads the PDF and answers the question

// 5. Send the answer back to the user

```

## Example Conversation

**You:** *Upload a PDF about dogs*

**Chatbot:** ✅ PDF uploaded successfully!

**You:** "What does this document say about dog training?"

**Claude AI:** "Based on the document, it mentions three main training methods: positive reinforcement, clicker training, and consistency in commands..."

## Troubleshooting

**Problem:** "Cannot find module" error

**Solution:** Run `npm install` again

**Problem:** "Invalid API key" error

**Solution:** Check your `.env` file has the correct API key

**Problem:** Can't upload PDF

**Solution:** Make sure the `uploads` folder exists

**Problem:** Website won't load

**Solution:** Make sure the `public` folder has `index.html`

## What's Different from the Complex Version?

This simple version:

- ✅ Only handles one PDF at a time (easier to understand)

- ✅ Uses simple storage (no database needed)

- ✅ Has clear, step-by-step comments

- ✅ Uses basic HTML and JavaScript

- ✅ Focuses on core functionality only

The complex version has:

- Multiple PDF support

- Database storage

- Advanced chunking

- Better error handling

- Production-ready features

## Next Steps

Once you understand this simple version, you can:


1. Add more features (like uploading multiple PDFs)

2. Make it look prettier with better CSS

3. Add user accounts and login

4. Deploy it to the internet so others can use it

5. Connect it to a real database

## Cost

- Node.js: Free

- Claude AI: Pay per use (very cheap for testing)

- Your first few questions will cost just a few cents

Happy coding! 🚀