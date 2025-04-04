const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve the homepage form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve all generated pages (like /hello.html)
app.use(express.static(__dirname));

// Create new page
app.post('/create', (req, res) => {
    const slug = req.body.slug.trim().toLowerCase().replace(/\s+/g, '-');
    const content = req.body.content;

    if (!slug || !content) {
        return res.status(400).send('Slug and content are required!');
    }

    const filePath = path.join(__dirname, `${slug}.html`);

    if (fs.existsSync(filePath)) {
        return res.status(409).send('That page already exists!');
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${slug}</title>
</head>
<body>
  ${content}
</body>
</html>
    `.trim();

    fs.writeFileSync(filePath, html);
    res.redirect(`/${slug}.html`);
});

app.listen(PORT, () => {
    console.log(`✅ Server live at http://localhost:${PORT}`);
});
