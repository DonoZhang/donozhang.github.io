const fs = require('fs');
const path = require('path');
const marked = require('marked');
const readline = require('readline');

function generateTemplate(category, title, urlName) {
    const author = "Dapeng Zhang";
    const date = new Date().toLocaleDateString();

    const contentFilePath = path.join(__dirname, 'articles', 'content.txt');

    if (!fs.existsSync(contentFilePath)) {
        console.log('Content file does not exist. Please create a content.txt file in the articles folder.');
        return;
    }

    const content = fs.readFileSync(contentFilePath, 'utf8');
    const formattedContent = marked.parse(content); 

    const categoryDir = path.join(__dirname, 'articles', category);
    if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
    }

    const articleDir = path.join(categoryDir, urlName.toLowerCase());
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="../../../styles.css">
    </head>
    <body>
        <header>
            <div class="container">
                <h1>Dapeng Zhang's Blog</h1>
            </div>
        </header>
        <div class="container">
            <main>
                <article>
                    <header>
                        <h1>${title}</h1>
                        <p class="meta-info">Published on ${date} by ${author}</p>
                    </header>
                    ${formattedContent}
                </article>
                <a class="back-link" href="../../../index.html">Back to Home</a>
                <a class="share-link" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://donozhang.github.io/articles/${category}/${urlName.toLowerCase()}/index.html`)}" target="_blank">
                    Share on LinkedIn
                </a>
            </main>
        </div>
    </body>
    </html>`;

    fs.writeFileSync(articlePath, articleContent, 'utf8');

    updateIndex();
}

function updateIndex() {
    const articlesDir = path.join(__dirname, 'articles');
    const indexPath = path.join(__dirname, 'index.html');
    let indexContent = fs.readFileSync(indexPath, 'utf8');

    const articlesList = {};

    fs.readdirSync(articlesDir).forEach(category => {
        const categoryPath = path.join(articlesDir, category);
        if (fs.lstatSync(categoryPath).isDirectory()) {
            articlesList[category] = [];
            fs.readdirSync(categoryPath).forEach(article => {
                const articlePath = path.join(categoryPath, article);
                if (fs.lstatSync(articlePath).isDirectory()) {
                    const articleHtmlPath = path.join(articlePath, 'index.html');
                    const articleContent = fs.readFileSync(articleHtmlPath, 'utf8');
                    const titleMatch = articleContent.match(/<title>(.*?)<\/title>/);
                    const dateMatch = articleContent.match(/Published on (.*?) by/);
                    if (titleMatch && dateMatch) {
                        const articleTitle = titleMatch[1];
                        const articleDate = dateMatch[1];
                        const articleUrl = path.join('articles', category, article, 'index.html');
                        articlesList[category].push({ title: articleTitle, url: articleUrl, date: articleDate });
                    }
                }
            });
        }
    });

    // Sort articles by date
    for (const category in articlesList) {
        articlesList[category].sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Generate HTML for articles
    let articlesHtml = '';
    for (const category in articlesList) {
        articlesHtml += `<h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3><div class="article-list">`;
        articlesList[category].forEach(article => {
            articlesHtml += `
            <div class="article-card">
                <div class="article-card__content">
                    <h4 class="article-card__title"><a href="${article.url}">${article.title}</a></h4>
                    <p class="article-card__date">${article.date}</p>
                </div>
            </div>`;
        });
        articlesHtml += '</div>';
    }

    indexContent = indexContent.replace(/<div id="articles-list">[\s\S]*?<\/div>/, `<div id="articles-list">\n${articlesHtml}\n</div>`);

    fs.writeFileSync(indexPath, indexContent, 'utf8');
}

if (require.main === module) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter the category of the article (e.g., security, devops): ', (category) => {
        rl.question('Enter the title of the article: ', (title) => {
            rl.question('Enter the URL name for the article (e.g., security-as-code): ', (urlName) => {
                generateTemplate(category, title, urlName);
                rl.close();
            });
        });
    });
}

module.exports = generateTemplate;