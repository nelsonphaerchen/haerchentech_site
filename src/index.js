import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import { marked } from 'marked';
import matter from 'front-matter';

const app = new Hono();

// Servir arquivos estáticos (CSS, imagens, JS)
app.use('/public/*', serveStatic({ root: './' }));
app.use('/images/*', serveStatic({ root: './posts/' }));

// Carrega todos os arquivos .md em tempo de compilação
const markdownFiles = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true });

function getPosts() {
  const posts = [];
  for (const path in markdownFiles) {
    const slug = path.split('/').pop().replace('.md', '');
    const content = markdownFiles[path];
    const parsed = matter(content);

    posts.push({
      slug,
      title: parsed.attributes.title || slug,
      date: parsed.attributes.date || new Date().toISOString().split('T')[0],
      description: parsed.attributes.description || '',
      rawDate: new Date(parsed.attributes.date || Date.now())
    });
  }
  return posts.sort((a, b) => b.rawDate - a.rawDate);
}

// Layout do Terminal
function renderLayout(title, content) {
  return `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <link rel="stylesheet" href="/public/style.css">
</head>
<body>
    <div class="terminal-container">
        <header>
            <nav>
                <a href="/">./blog</a>
                <a href="/portfolio">./portfolio</a>
                <a href="/contato">./contato</a>
            </nav>
            <button id="theme-toggle" class="theme-btn">[Modo Claro]</button>
        </header>
        ${content}
    </div>
    <script src="/public/theme.js"></script>
</body>
</html>`;
}

// ROTAS
app.get('/', (c) => {
  const posts = getPosts();
  const html = `
    <h1>Posts Recentes</h1>
    <ul>
      ${posts.map(post => `
        <li>
          <h2><a href="/post/${post.slug}">${post.title}</a></h2>
          <small>> Data: ${post.date}</small>
          <p>${post.description}</p>
        </li>
      `).join('')}
    </ul>
  `;
  return c.html(renderLayout('Terminal Blog', html));
});

app.get('/post/:slug', (c) => {
  const slug = c.req.param('slug');
  const postPath = `../posts/${slug}.md`;
  const rawContent = markdownFiles[postPath];

  if (!rawContent) {
    return c.text('Post não encontrado', 404);
  }

  const parsed = matter(rawContent);
  const htmlContent = marked(parsed.body);

  const html = `
    <article>
        <h1>${parsed.attributes.title}</h1>
        <small>> Publicado em: ${parsed.attributes.date}</small>
        <hr>
        <div>${htmlContent}</div>
    </article>
  `;
  return c.html(renderLayout(parsed.attributes.title, html));
});

app.get('/portfolio', (c) => {
  const html = `
    <h1>Meus Projetos</h1>
    <ul>
        <li><strong>Projeto 1</strong>: Automação em Node.js <br><a href="https://github.com" target="_blank">[Ver no GitHub]</a></li>
    </ul>
  `;
  return c.html(renderLayout('Portfólio', html));
});

app.get('/contato', (c) => {
  const html = `
    <h1>Contato</h1>
    <ul>
        <li><strong>GitHub:</strong> <a href="https://github.com" target="_blank">github.com</a></li>
    </ul>
  `;
  return c.html(renderLayout('Contato', html));
});

export default app;