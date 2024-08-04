const fs = require('fs');
const path = require('path');
const prompt = require('prompt-sync')();

function generateTemplate() {
    const category = prompt('Enter the category of the article (e.g., security, devops): ');
    const title = prompt('Enter the title of the article: ');

    const contentFilePath = path.join(__dirname, 'articles', 'content.txt');

    if (!fs.existsSync(contentFilePath)) {
        console.log('Content file does not exist. Please create a content.txt file in the articles folder.');
        return;
    }

    const content = fs.readFileSync(contentFilePath, 'utf8');

    const categoryDir = path.join(__dirname, 'articles', category);
    if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
    }

    const articleDir = path.join(categoryDir, title.replace(/\s+/g, '-').toLowerCase());
    if (!fs.existsSync(articleDir)) {
        fs.mkdirSync(articleDir);
    }

    const articlePath = path.join(articleDir, 'index.html');
    const articleContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <link rel="stylesheet" href="../../../styles.css">
    </head>
    <body>
        <header>
            <h1>${title}</h1>
        </header>
        <main>
            <p>${content}</p>
            <a href="../../../index.html">Back to Home</a>
        </main>
    </body>
    </html>`;

    fs.writeFileSync(articlePath, articleContent, 'utf8');

    updateIndex(title, path.join('articles', category, title.replace(/\s+/g, '-').toLowerCase(), 'index.html'));
}

function updateIndex(title, url) {
    const indexPath = path.join(__dirname, 'index.html');
    let indexContent = fs.readFileSync(indexPath, 'utf8');

    const newArticleEntry = `<li><a href="${url}">${title}</a></li>`;
    const ulEndIndex = indexContent.indexOf('</ul>');
    indexContent = indexContent.slice(0, ulEndIndex) + newArticleEntry + indexContent.slice(ulEndIndex);

    fs.writeFileSync(indexPath, indexContent, 'utf8');
}

generateTemplate();
