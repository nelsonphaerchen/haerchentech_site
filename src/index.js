import { Hono } from 'hono';
import { marked } from 'marked';
import matter from 'front-matter';

const app = new Hono();

const markdownFiles = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true });

function getPosts() {
  const posts = [];
  for (const path in markdownFiles) {
    const slug = path.split('/').pop().replace('.md', '');
    const raw = markdownFiles[path];
    const parsed = matter(typeof raw === 'string' ? raw : String(raw));
    posts.push({
      slug,
      title: parsed.attributes.title || slug,
      date: parsed.attributes.date || '',
      description: parsed.attributes.description || '',
      rawDate: new Date(parsed.attributes.date || 0),
    });
  }
  return posts.sort((a, b) => b.rawDate - a.rawDate);
}

function layout(title, body) {
  return `<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="/style.css">
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
    ${body}
  </div>
  <script src="/theme.js"></script>
</body>
</html>`;
}

app.get('/', (c) => {
  const posts = getPosts();
  const body = `
    <h1>Posts Recentes</h1>
    <ul>
      ${posts.map(p => `
        <li>
          <h2><a href="/post/${p.slug}">${p.title}</a></h2>
          <small>&gt; Data: ${p.date}</small>
          <p>${p.description}</p>
        </li>`).join('')}
    </ul>`;
  return c.html(layout('Terminal Blog', body));
});

app.get('/post/:slug', (c) => {
  const slug = c.req.param('slug');
  const key = `../posts/${slug}.md`;
  const raw = markdownFiles[key];

  if (!raw) return c.text('Post não encontrado', 404);

  const parsed = matter(typeof raw === 'string' ? raw : String(raw));
  const htmlContent = marked(parsed.body);
  const body = `
    <article>
      <h1>${parsed.attributes.title || slug}</h1>
      <small>&gt; Publicado em: ${parsed.attributes.date || ''}</small>
      <hr>
      <div>${htmlContent}</div>
    </article>`;
  return c.html(layout(parsed.attributes.title || slug, body));
});

app.get('/portfolio', (c) => {
  const body = `
    <h1>Meus Projetos</h1>
    <ul>
      <li>
        <strong>Este Site</strong>: Blog pessoal construído com Hono e Cloudflare Workers.
        <br><a href="https://github.com/nelsonphaerchen/haerchentech_site" target="_blank">[Ver no GitHub]</a>
      </li>
      <li>
        <strong>Automação e DevOps</strong>: Scripts e projetos de automação.
        <br><a href="https://github.com/nelsonphaerchen/portifolio" target="_blank">[Ver no GitHub]</a>
      </li>
    </ul>`;
  return c.html(layout('Portfólio', body));
});

app.get('/contato', (c) => {
  const body = `
    <h1>Contato</h1>
    <ul>
      <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/nelsonphaerchen/" target="_blank">nelsonphaerchen</a></li>
      <li><strong>GitHub:</strong> <a href="https://github.com/nelsonphaerchen" target="_blank">nelsonphaerchen</a></li>
      <li><strong>Email:</strong> <a href="mailto:haerchen@gmail.com">haerchen@gmail.com</a></li>
    </ul>`;
  return c.html(layout('Contato', body));
});

app.get('/curriculum', (req, res) => {
    res.render('curriculum', {
        profile: {
            name: "Nelson Pedro Haerchen",
            title: "DevOps Engineer | Platform Engineer | SRE",
            location: "Indaial, Santa Catarina, Brasil",
            phone: "+55 47 9 9260-3552",
            email: "haerchen@gmail.com",
            linkedin: "https://linkedin.com/in/nelsonphaerchen/",
            github: "https://github.com/nelsonphaerchen",
            summary: "Engenheiro DevOps / Infraestrutura Sênior com ampla experiência..."
        },
        skills: [
            { category: "Cloud & Infraestrutura", items: "AWS (EC2, ECS, VPC, IAM, S3), VMware vSphere..." },
            { category: "Containers & Orquestração", items: "Kubernetes, Docker, Helm, ArgoCD..." }
        ],
        experiences: [
            {
                company: "Autônomo / Projetos Independentes",
                role: "Consultor de Infraestrutura e Automação (Freelancer)",
                period: "Julho de 2026 – Presente",
                responsibilities: [
                    "Integração de automação de fluxos de trabalho com n8n...",
                    "Aplicação do Claude Code e estratégias avançadas..."
                ]
            }
        ],
        education: [
            {
                degree: "Tecnólogo em Gestão da Tecnologia da Informação",
                institution: "UNICESUMAR",
                status: "Concluído em Novembro de 2018"
            }
        ],
        languages: [
            { name: "Português", level: "Nativo" },
            { name: "Inglês", level: "C1 (Avançado / Fluente)" }
        ]
    });
});

export default app;
