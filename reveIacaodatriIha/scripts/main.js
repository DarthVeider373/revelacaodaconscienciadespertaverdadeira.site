/* Carrega o player de vídeo (VTurb) */
function carregarPlayer() {
  var s = document.createElement('script');
  s.src = 'https://scripts.converteai.net/451b8c85-4f8c-4a59-8e5a-8f8a9ed15938/players/6a74caaa757db63207ad4300/v4/player.js';
  s.async = true;
  document.head.appendChild(s);
}

/* Motor dos comentários ao vivo (feed simulado) */
function iniciarComentariosAoVivo() {
  var comentarios = [
    { n: 'Maria das Graças', img: 5, t: 'Que mensagem linda, chorei aqui em casa 🙏' },
    { n: 'Sebastião Ferreira', img: 12, t: 'Padre Pio, rogai por nós! Amém 🙏' },
    { n: 'Ana Cláudia Souza', img: 45, t: 'Estou emocionada com esse testemunho, Deus é fiel!' },
    { n: 'João Batista', img: 33, t: 'Assistindo aqui de Fortaleza-CE, que bênção 🙌' },
    { n: 'Rosângela Lima', img: 47, t: 'Já compartilhei com toda a minha família ❤️' },
    { n: 'Antônio Carlos', img: 60, t: 'Precisava ouvir isso hoje. Obrigado, Senhor.' },
    { n: 'Cleuza Aparecida', img: 26, t: 'Deus abençoe grandemente esse trabalho 🙏' },
    { n: 'Marcos Vinícius', img: 3, t: 'Arrepiei do começo ao fim, glória a Deus!' },
    { n: 'Terezinha Gomes', img: 32, t: 'Assistindo do interior de Minas 💙' },
    { n: 'Paulo Roberto', img: 15, t: 'Que testemunho poderoso, não consegui parar de assistir.' },
    { n: 'Fátima Nascimento', img: 44, t: 'Minha fé se renovou hoje. Muito obrigada!' },
    { n: 'José Aparecido', img: 52, t: 'São Pio de Pietrelcina, intercedei por nós!' },
    { n: 'Sandra Regina', img: 20, t: 'Chorando de emoção aqui 😭❤️' },
    { n: 'Geraldo Magela', img: 51, t: 'Palavra abençoada, tocou meu coração.' },
    { n: 'Luciana Martins', img: 25, t: 'Vou assistir até o final, está maravilhoso!' },
    { n: 'Benedito Alves', img: 68, t: 'Deus no comando sempre 🙏🙏' },
    { n: 'Vera Lúcia', img: 49, t: 'Que Deus continue abençoando esse ministério.' },
    { n: 'Reginaldo Santos', img: 8, t: 'Amém! Compartilhando com meu grupo de oração.' },
    { n: 'Aparecida Ramos', img: 24, t: 'Que paz senti ao assistir isso 🕊️' },
    { n: 'Francisco das Chagas', img: 55, t: 'Obrigado por essa mensagem, estava precisando.' },
    { n: 'Neusa Barbosa', img: 30, t: 'Simplesmente maravilhoso, glória a Deus!' },
    { n: 'Edson Ribeiro', img: 11, t: 'Assistindo de São Paulo, muito forte isso 🙏' },
    { n: 'Conceição Dias', img: 43, t: 'Meu coração está transbordando de fé ❤️' },
    { n: 'Wellington Costa', img: 14, t: 'Que Deus abençoe todos que estão assistindo!' }
  ];

  var cores = ['#0a4f8c', '#1a8a4a', '#b5651d', '#7a3e9d', '#c0392b', '#0e7c86'];
  var tempos = ['agora', 'há 1 min', 'há 2 min', 'há 3 min', 'há 4 min', 'há 6 min'];
  var feed = document.getElementById('cn-feed');
  var onlineEl = document.getElementById('cn-online');
  var inicioComentarios = Date.now();
  var LIMITE_MS = 45000; // para de exibir novos comentários após 45s
  var idx = 0;

  // embaralha para não repetir a mesma ordem sempre
  for (var k = comentarios.length - 1; k > 0; k--) {
    var j = Math.floor(Math.random() * (k + 1));
    var tmp = comentarios[k];
    comentarios[k] = comentarios[j];
    comentarios[j] = tmp;
  }

  function iniciais(nome) {
    var p = nome.trim().split(/\s+/);
    return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase();
  }

  function avatarFallback(nome) {
    var cor = cores[nome.length % cores.length];
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="84" height="84">' +
      '<rect width="100%" height="100%" fill="' + cor + '"/>' +
      '<text x="50%" y="50%" dy=".35em" text-anchor="middle" fill="#fff" ' +
      'font-family="Arial" font-size="34" font-weight="700">' + iniciais(nome) + '</text></svg>';
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  function criar(c) {
    var el = document.createElement('div');
    el.className = 'cn-c';
    var likes = Math.floor(Math.random() * 46) + 2;
    var tempo = tempos[Math.floor(Math.random() * tempos.length)];

    var img = document.createElement('img');
    img.className = 'cn-av';
    img.alt = '';
    img.loading = 'lazy';
    img.src = 'https://i.pravatar.cc/84?img=' + c.img;
    img.addEventListener('error', function () { this.src = avatarFallback(c.n); }, { once: true });

    var body = document.createElement('div');
    body.className = 'cn-body';
    body.innerHTML =
      '<div class="cn-name">' + c.n + ' <span class="cn-badge">✔ Membro</span></div>' +
      '<div class="cn-txt">' + c.t + '</div>' +
      '<div class="cn-meta"><span><b>👍 ' + likes + '</b></span><span>Responder</span><span>' + tempo + '</span></div>';

    el.appendChild(img);
    el.appendChild(body);
    return el;
  }

  function adicionar() {
    var c = comentarios[idx % comentarios.length];
    idx++;
    feed.insertBefore(criar(c), feed.firstChild);

    // mantém no máximo 6 visíveis, removendo o mais antigo com fade
    if (feed.children.length > 6) {
      var ultimo = feed.lastElementChild;
      ultimo.classList.add('cn-out');
      setTimeout(function () {
        if (ultimo && ultimo.parentNode) ultimo.parentNode.removeChild(ultimo);
      }, 450);
    }

    // varia levemente o número de "assistindo agora"
    if (onlineEl) {
      var base = 1284 + Math.floor(Math.random() * 60) - 20;
      onlineEl.textContent = base.toLocaleString('pt-BR');
    }

    // após o limite, não agenda mais novos comentários (mantém os já visíveis)
    if (Date.now() - inicioComentarios < LIMITE_MS) {
      setTimeout(adicionar, 1800 + Math.random() * 2800);
    }
  }

  // começa com 3 comentários já na tela
  for (var s = 0; s < 3; s++) {
    feed.appendChild(criar(comentarios[idx % comentarios.length]));
    idx++;
  }
  setTimeout(adicionar, 2200);
}

/* Back redirect: prende o botão "voltar" e leva pra página de retenção */
function protegerBotaoVoltar() {
  history.pushState(null, '', location.href);
  window.addEventListener('popstate', function () {
    window.location.href = 'espere.html' + (location.search || '');
  });
}

carregarPlayer();
iniciarComentariosAoVivo();
protegerBotaoVoltar();
