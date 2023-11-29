
<h1>Painel Admin</h1>
<h2>README - Implantação de Painel Admin com Firebase Hosting e Firebase Functions</h2>

<h3>Pré-requisitos</h3>
<ul>
    <li><strong>Node.js instalado</strong>: <a href="https://nodejs.org/" target="_new">Node.js</a></li>
    <li><strong>Firebase CLI instalado</strong>: Execute <code>npm install -g firebase-tools</code></li>
    <li><strong>Conta no Firebase</strong>: <a href="https://firebase.google.com/" target="_new">Firebase</a></li>
    <li><strong>Acesso ao repositório GitHub do projeto</strong></li>
</ul>

<h3>Configuração Inicial</h3>
<h4>Clone o Repositório do GitHub</h4>
<p>Use o comando <code>git clone https://github.com/Squad13Porto/PortalAdminAngular.git</code> para clonar o repositório para sua máquina local.</p>

<h4>Instale as Dependências</h4>
<p>Navegue até a pasta do projeto e execute <code>npm install</code> para instalar as dependências do projeto.</p>

<h3>Configuração do Firebase</h3>
<h4>Login no Firebase</h4>
<p>Execute <code>firebase login</code> para entrar na sua conta Firebase.</p>

<h4>Inicialize o Firebase no Projeto</h4>
<ul>
    <li>Na pasta do projeto, execute <code>firebase init</code>.</li>
    <li>Selecione as opções relevantes para seu projeto, especialmente 'Hosting' e 'Functions'.</li>
    <li>Caso tenha selecionado para o hosting criar a pasta Public, coloque os fontes dentro da pasta crieada chamada <code> public </code></li>
    <li>Depois de inicializar o firebase functions, coloque o <code>index.js</code> e o json de chave privada dentro da pasta <code>Functions</code></li>
    <li>Depois disso, rode um <code>npm install</code> novamente e está feita a configuração</li>
    <li>OBS: Criação de novas rotas do Functions, ou edição das atuais, são feitas diretamente no <code>index.js</code> e pode seguir o passo de implantação do Functions</li>
</ul>

<h3>Configuração de Destinos de Implantação</h3>
<ul>
    <li>Execute <code>firebase target:apply hosting painel-admin-coletiva painel-admin-coletiva</code> para definir o destino de implantação para o site específico do Hosting.</li>
    <li>Adicione a referência ao seu <code>painel-admin-coletiva</code> no arquivo <code>firebase.json</code>.</li>
    <li>OBS: Por padrão o firebase.json ja está configurado nesse formato, mas ainda sim é necessario rodar o primeiro passo dessa etapa.</li>
</ul>

<h3>Build e Implantação</h3>
<h4>Build do Painel Admin</h4>
<ul>
    <li>Como o projeto usa HTML, JS e CSS puro, não é necessário um processo de build específico.</li>
</ul>

<h4>Implante no Firebase Hosting</h4>
<ul>
    <li>Execute <code>firebase deploy --only hosting:painel-admin-coletiva</code> para implantar o site no Firebase Hosting.</li>
</ul>

<h4>Implante o Firebase Functions</h4>
<ul>
    <li>Execute <code>firebase deploy --only functions</code> para implantar suas funções do Firebase.</li>
</ul>

<h3>Verificação</h3>
<ul>
    <li>Após a implantação, verifique se o painel admin e as funções do Firebase estão funcionando corretamente.</li>
</ul>

<h3>Atualizações Futuras</h3>
<ul>
    <li>Para atualizações futuras, repita os passos de implantação conforme necessário, sem substituir arquivos críticos como <code>index.js</code> e a chave privada do Firebase.</li>
</ul>

<hr>

