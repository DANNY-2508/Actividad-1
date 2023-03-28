function search() {
    const query = document.querySelector('#search-query').value.toLowerCase();
    const articles = document.querySelectorAll('.news-article');
    
    articles.forEach(article => {
      const title = article.querySelector('h3').textContent.toLowerCase();
      const content = article.querySelector('p').textContent.toLowerCase();
      
      if (title.includes(query) || content.includes(query)) {
        article.style.display = 'block';
      } else {
        article.style.display = 'none';
      }
    });
  }
  
  function filterByCategory(event) {
    const category = event.target.textContent;
    const articles = document.querySelectorAll('.news-article');
    
    articles.forEach(article => {
      const categoryElement = article.querySelector('.category');
      
      if (category === 'Todas' || categoryElement.textContent === category) {
        article.style.display = 'block';
      } else {
        article.style.display = 'none';
      }
    });
  }
  