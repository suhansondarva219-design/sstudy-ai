SSTUDY.com — Real AI version

IMPORTANT: This project uses a Netlify serverless function so the Gemini API key stays on the server. Do not put the key in index.html.

PUBLISH STEPS (beginner-friendly):
1. Download and extract sstudy-ai.zip.
2. Create a free account at https://github.com/ and create a NEW repository named sstudy-ai.
3. Upload the files/folders inside this extracted folder to the repository (index.html, netlify.toml, and netlify/functions/ask.mjs).
4. Create/login at https://www.netlify.com/ and choose Add new site / Import an existing project.
5. Connect your GitHub repository and deploy. The included netlify.toml configures the site and function.
6. Get a Gemini API key from https://aistudio.google.com/ (availability and quotas depend on Google's current terms/settings).
7. In Netlify: Site configuration -> Environment variables, add:
   Key: GEMINI_API_KEY
   Value: your actual API key
8. Trigger a new deploy after adding the variable.
9. Open the published Netlify URL, go to Study Helper, ask a question, and test it.

Do not publish the API key in GitHub, HTML, screenshots, or chat. If you already exposed a key publicly, revoke it and create a new one.

Local preview: index.html can be opened in a browser, but real AI answers will only work after deploying the Netlify function and setting GEMINI_API_KEY. Opening index.html directly on your computer does not run the function.

The site has no student login or database yet. AI-generated answers may be incorrect; check important information against your textbook/teacher. Watch your API usage and any provider limits or charges.
