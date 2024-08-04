document.addEventListener("DOMContentLoaded", function() {
    fetchArticles();
});

function fetchArticles() {
    // This function will fetch articles from the articles folder and populate the index page
    const articlesList = document.getElementById('articles-list');
    const articles = [
        // This should be dynamically populated by template-generator.js
        { title: "Sample Article 1", url: "articles/security/sample-article-1/index.html" },
        { title: "Sample Article 2", url: "articles/devops/sample-article-2/index.html" }
    ];

    articlesList.innerHTML = '';
    articles.forEach(article => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = article.url;
        link.textContent = article.title;
        listItem.appendChild(link);
        articlesList.appendChild(listItem);
    });
}
