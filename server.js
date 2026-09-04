const express = require('express');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const matter = require('front-matter');

const app = express();
const PORT = 3000;

// Configuração do EJS e pasta pública
app.set('view engine', 'ejs');
app.use(express.static('public'));


// ROTA 1: Página Inicial / Blog (Lê todos os .md e ordena por data/arquivo)
app.get('/', (req, res) => {
    const postsDir = path.join(__dirname, 'posts');
    
    fs.readdir(postsDir, (err, files) => {
        if (err) {
            return res.render('index', { posts: [] });
        }

        const posts = files
            .filter(file => file.endsWith('.md'))
            .map(file => {
                const slug = file.replace('.md', '');
                const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
                const parsed = matter(content);

                // Recupera data de modificação para ordenar caso não tenha data no front-matter
                const stats = fs.statSync(path.join(postsDir, file));

                return {
                    slug,
                    title: parsed.attributes.title || slug,
                    date: parsed.attributes.date || stats.mtime,
                    description: parsed.attributes.description || '',
                    rawDate: new Date(parsed.attributes.date || stats.mtime)
                };
            })
            // Ordena do mais recente para o mais antigo (último adicionado no topo)
            .sort((a, b) => b.rawDate - a.rawDate);

        res.render('index', { posts });
    });
});

// ROTA 2: Leitura do Post Individual
app.get('/post/:slug', (req, res) => {
    const filePath = path.join(__dirname, 'posts', `${req.params.slug}.md`);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send('Post não encontrado');
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(content);
    const htmlContent = marked(parsed.body);

    res.render('post', {
        title: parsed.attributes.title,
        date: parsed.attributes.date,
        content: htmlContent
    });
});

// ROTA 3: Portfólio
app.get('/portfolio', (req, res) => {
    const projetos = [
        { nome: 'Projeto 1', desc: 'Descrição do projeto em Node.js', link: 'https://github.com/nelsonphaerchen/haerchentech_site' },
        { nome: 'Projeto 2', desc: 'Automação e DevOps', link: 'https://github.com/nelsonphaerchen/portifolio' }
    ];
    res.render('portfolio', { projetos });
});

// ROTA 4: Contato
app.get('/contato', (req, res) => {
    res.render('contato', {
        linkedin: 'https://www.linkedin.com/in/nelsonphaerchen',
        github: 'https://github.com/nelsonphaerchen',
        email: 'haerchen@gmail.com'
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Configuração de arquivos estáticos da pasta public
app.use(express.static('public'));

// NOVA LINHA: Torna a pasta posts/images acessível publicamente via URL /images
app.use('/images', express.static(path.join(__dirname, 'posts', 'images')));