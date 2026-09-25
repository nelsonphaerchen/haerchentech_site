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
        <a href="/curriculum">./curriculum</a>
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

app.get('/curriculum', (c) => {
  const body = `
    <h1>Nelson Pedro Haerchen</h1>
    <div class="subtitle" style="font-weight: bold; margin-bottom: 12px; color: var(--accent, #2b6cb0);">DevOps Engineer | Platform Engineer | SRE</div>
    
    <div class="contact-info" style="margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid currentColor;">
      <span>📍 Indaial, Santa Catarina, Brasil</span> | 
      <span>📞 +55 47 9 9260-3552</span> | 
      <span>✉️ <a href="mailto:haerchen@gmail.com">haerchen@gmail.com</a></span> | 
      <span>🔗 <a href="https://linkedin.com/in/nelsonphaerchen/" target="_blank">LinkedIn</a></span> | 
      <span>💻 <a href="https://github.com/nelsonphaerchen" target="_blank">GitHub</a></span>
    </div>

    <h2>Perfil Profissional</h2>
    <p>
      Engenheiro DevOps / Infraestrutura Sênior com ampla experiência na manutenção de ambientes escaláveis em AWS, automação de esteiras de CI/CD via Kubernetes e GitOps, e otimização de infraestrutura como código (IaC). Histórico comprovado na elevação da confiabilidade de sistemas através de observabilidade, automação orientada a Python e fluxos de trabalho assistidos por IA para entregar soluções multicloud de alto desempenho, resilientes e seguras.
    </p>

    <h2>Competências Técnicas</h2>
    <ul>
      <li><strong>Cloud &amp; Infraestrutura:</strong> AWS (EC2, ECS, VPC, IAM, S3), VMware vSphere, vCloud, Arquitetura de Nuvem Híbrida</li>
      <li><strong>Infraestrutura como Código &amp; Configuração:</strong> Terraform, Ansible, Cloud-Init, Vault</li>
      <li><strong>Containers &amp; Orquestração:</strong> Kubernetes, Docker, Helm, ArgoCD (GitOps Continuous Delivery)</li>
      <li><strong>Observabilidade &amp; Confiabilidade:</strong> Prometheus, Alertmanager, Grafana, Gestão de Logs, Monitoramento de Saúde de Sistemas</li>
      <li><strong>Automação &amp; Desenvolvimento:</strong> Python, FastAPI, Bash/Shell Scripting, n8n (Automação de Fluxos de Trabalho Low-Code/No-Code)</li>
      <li><strong>IA &amp; Engenharia de Prompts:</strong> Claude Code, Otimização de Prompts para LLMs, Ajuste Fino (Fine-Tuning) e Suporte ao Treinamento de Modelos de IA (Datasets de Voz/Pronúncia e Sotaques)</li>
      <li><strong>Sistemas Operacionais &amp; Redes:</strong> Linux (RHEL, CentOS, Ubuntu, FreeBSD), Windows Server, Active Directory, Firewalls, Segurança de Rede</li>
      <li><strong>Bancos de Dados:</strong> PostgreSQL, MySQL, Oracle DB</li>
      <li><strong>Metodologias &amp; Suporte:</strong> Cultura DevOps, Engenharia de Confiabilidade de Sites (SRE), Escalação de Suporte Técnico (L1-L3), Capacitação de Stakeholders</li>
    </ul>

    <h2>Experiência Profissional</h2>

    <div class="job-header" style="margin-top: 14px; margin-bottom: 6px;">
      <strong>Autônomo / Projetos Independentes</strong> — <em>Consultor de Infraestrutura e Automação (Freelancer)</em>
      <span style="float: right;">Julho de 2026 – Presente</span>
    </div>
    <div style="clear: both;"></div>
    <ul>
      <li>Integração de automação de fluxos de trabalho com n8n para otimizar alertas operacionais, roteamento de tarefas e integrações de serviços.</li>
      <li>Aplicação do Claude Code e estratégias avançadas de engenharia de prompts para construir ferramentas de desenvolvimento assistidas por IA e scripts de automação.</li>
      <li>Participação em projetos de treinamento e refinamento de modelos de IA, avaliando e aprimorando a precisão de prompts, datasets fonéticos e de voz, variação de sotaques e fidelidade de pronúncia para modelos de fala baseados em IA.</li>
    </ul>

    <div class="job-header" style="margin-top: 14px; margin-bottom: 6px;">
      <strong>Upwork</strong> — <em>Engenheiro de Infraestrutura (Remoto)</em>
      <span style="float: right;">Maio de 2021 – Maio de 2026</span>
    </div>
    <div style="clear: both;"></div>
    <ul>
      <li>Projeção, provisionamento e gerenciamento de ambientes escaláveis na AWS (EC2, ECS, Networking) utilizando Terraform, garantindo infraestrutura reproduzível em ambientes de execução e QA.</li>
      <li>Automação de implantação de aplicações e padronização de ambientes no Kubernetes utilizando Docker, Helm e ArgoCD para entrega contínua transparente (GitOps).</li>
      <li>Padronização da manutenção de sistemas operacionais e do provisionamento de servidores em frotas com múltiplos SOs (Linux e Windows) utilizando playbooks e automação baseada em funções do Ansible.</li>
      <li>Implementação de stacks de observabilidade centralizadas usando Prometheus, Alertmanager e Grafana; desenvolvimento de microsserviços internos e endpoints de API para automação usando Python e FastAPI.</li>
      <li>Configuração e manutenção de esteiras de CI/CD no Jenkins para automatizar builds de imagens Docker, execução de testes de regressão e QA, e fluxos de trabalho de deploy com Ansible.</li>
      <li>Gerenciamento do versionamento de código-fonte no Bitbucket e estabelecimento de integrações via webhooks com o Jenkins para disparar compilações automatizadas de CI e esteiras de testes de QA.</li>
      <li>Integração do SonarQube aos processos de build criando imagens de contêiner personalizadas e executando análises automatizadas de segurança e qualidade do código-fonte.</li>
    </ul>

    <div class="job-header" style="margin-top: 14px; margin-bottom: 6px;">
      <strong>Unifique</strong> — <em>Analista de Datacenter</em>
      <span style="float: right;">Setembro de 2019 – Maio de 2021</span>
    </div>
    <div style="clear: both;"></div>
    <ul>
      <li>Gerenciamento de infraestrutura de hospedagem de alta disponibilidade e serviços de e-mail (cPanel, Apache, Postfix, MySQL e PostgreSQL) em sistemas RHEL, CentOS e FreeBSD.</li>
      <li>Aceleração do provisionamento em nuvem para ambientes VMware e vCloud utilizando Ansible e Terraform, reduzindo drasticamente os tempos de configuração manual.</li>
      <li>Desenvolvimento de scripts personalizados em Shell e Python para automatizar a administração rotineira de sistemas, aplicação de patches em servidores e rotinas de backup de banco de dados.</li>
    </ul>

    <div class="job-header" style="margin-top: 14px; margin-bottom: 6px;">
      <strong>NS Imp. Com. LTDA.</strong> — <em>Analista de Suporte de Infraestrutura</em>
      <span style="float: right;">Setembro de 2014 – Julho de 2019</span>
    </div>
    <div style="clear: both;"></div>
    <ul>
      <li>Administração de infraestrutura de rede principal, firewalls, Active Directory, hardware e ambientes com múltiplos servidores Linux/Windows Server entre diferentes filiais.</li>
      <li>Atuação no suporte multifuncional à matriz e aos usuários de filiais remotas, garantindo 99,9% de disponibilidade operacional e minimizando o tempo de inatividade dos usuários.</li>
    </ul>

    <div class="job-header" style="margin-top: 14px; margin-bottom: 6px;">
      <strong>Datainfo</strong> — <em>Analista de Suporte de Infraestrutura</em>
      <span style="float: right;">Maio de 2013 – Setembro de 2014</span>
    </div>
    <div style="clear: both;"></div>
    <ul>
      <li>Gerenciamento de ambientes Linux, Windows Server, Oracle DB, Active Directory e firewalls, enquanto prestava suporte de escala e nível avançado (L1-L3) para equipes internas e clientes.</li>
    </ul>

    <div class="job-header" style="margin-top: 14px; margin-bottom: 6px;">
      <strong>Taschibra</strong> — <em>Suporte de Sistemas e Redes</em>
      <span style="float: right;">Junho de 2008 – Maio de 2013</span>
    </div>
    <div style="clear: both;"></div>
    <ul>
      <li>Administração de ponta a ponta de firewalls de rede, Active Directory, servidores Windows, Linux e BSD, além de telefonia e manutenção de estações de trabalho e suporte aos usuários.</li>
    </ul>

    <h2>Formação Acadêmica</h2>
    <p>
      <strong>Tecnólogo em Gestão da Tecnologia da Informação</strong><br>
      UNICESUMAR — <em>Concluído em Novembro de 2018</em>
    </p>

    <h2>Idiomas</h2>
    <p>
      <strong>Português:</strong> Nativo<br>
      <strong>Inglês:</strong> C1 (Avançado / Fluente)
    </p>`;
  return c.html(layout('Currículo - Nelson Pedro Haerchen', body));
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

export default app;