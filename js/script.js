document.querySelector('#add').addEventListener('click', addJogador);
document.querySelector('#start').addEventListener('click', start);
document.querySelector('#load').addEventListener('click', load);
class Jogador {
  constructor(nome) {
    this.nome = nome;
    this.pontos = 0;
  }
}

var jogadores = [];
var partidas = [];

function addJogador() {
  let nome = document.querySelector('#nome').value;
  if (nome !== '') {
    if (jogadores.length === 0) {
      document.querySelector('#vazio').remove();
    }
    jogadores.push(new Jogador(nome));
    console.log(jogadores[0]);
    let html = `
      <tr id="jogador${jogadores.length - 1}">
        <td>
          ${jogadores[jogadores.length - 1].nome}
        </td>
        <td class="td-botao" id="delete-${jogadores.length - 1}">
          <button class="delete" onclick="deletaJogador(${
            jogadores.length - 1
          })">
            <img src="./img/x.png" alt="botao X">
          </button>
        </td>
      </tr>
    `;
    document.querySelector('#tbody-jogadores').innerHTML += html;
    document.querySelector('#nome').value = '';
  } else {
    alert('Preencha o nome do jogador!');
  }
}

document.querySelector('#nome').addEventListener('keydown', function (event) {
  if (event.keyCode === 13) {
    addJogador();
  }
});

function deletaJogador(id) {
  if (jogadores[id] !== undefined) {
    delete jogadores[id];
    let jogadorElement = document.querySelector('#jogador' + id);
    if (jogadorElement) {
      jogadorElement.remove();
    }

    let jogadoresNaoNulos = Object.values(jogadores).filter(function (jogador) {
      return jogador !== undefined && jogador !== null;
    });

    if (jogadoresNaoNulos.length === 0) {
      var vazioElement = document.querySelector('#vazio');
      if (!vazioElement) {
        var tbodyJogadores = document.querySelector('#tbody-jogadores');
        tbodyJogadores.innerHTML += `
          <tr id="vazio">
            <td>Vazio por agora. </td>
          </tr>
        `;
      }
    }
  }
}

function geraPartidas(jogadores) {
  jogadores = Object.values(jogadores).filter(function (jogador) {
    return jogador !== undefined && jogador !== null;
  });

  for (i = 0; i < jogadores.length; i++) {
    for (let j = i + 1; j < jogadores.length; j++) {
      partidas.push([jogadores[i], jogadores[j]]);
    }
  }
  console.log(jogadores);
}

function mostraPartidas(partidas) {
  geraPartidas(jogadores);
  let html = '';
  for (let i = 0; i < partidas.length; i++) {
    let partida = partidas[i];
    html += `
      <div class="partida" id="partida-${i}">
        <div class="partida-nomes" id="partida-nomes${i}">
          <p class="nome1">${partida[0].nome}</p>
          <p class="nome2">${partida[1].nome}</p>
        </div>
        <div class="partida-botoes" id="partida-botoes${i}">
          <button class="vencer" onclick="registraVitoria(${i}, 0)">
            <img src="./img/vencer.png" alt="icone de vitória">
          </button>
          <button class="vencer" onclick="registraVitoria(${i}, 1)">
            <img src="./img/vencer.png" alt="icone de vitória">
          </button>
        </div>
        <hr>
      </div>
    `;
  }

  document.querySelector('#partidas').innerHTML = html;
}

function registraVitoria(partidaIndex, vencedorIndex) {
  let partida = partidas[partidaIndex];
  let vencedor = partida[vencedorIndex];
  vencedor.pontos++;

  if (vencedorIndex === 0) {
    document.querySelector(`#partida-nomes${partidaIndex}`).innerHTML = `
      <p class="nome1 verde">${partidas[partidaIndex][0].nome}</p>
      <p class="nome2 vermelho">${partidas[partidaIndex][1].nome}</p>
    `;
    document.querySelector(`#partida-botoes${partidaIndex}`).innerHTML = `
      <button class="vencer vencedor">
        <img src="./img/vencer.png" alt="icone de vitória">
      </button>
      <button class="vencer perdedor">
        <img src="./img/vencer.png" alt="icone de vitória">
      </button>
    `;
  } else {
    document.querySelector(`#partida-nomes${partidaIndex}`).innerHTML = `
    <p class="nome1 vermelho">${partidas[partidaIndex][0].nome}</p>
    <p class="nome2 verde">${partidas[partidaIndex][1].nome}</p>
  `;
    document.querySelector(`#partida-botoes${partidaIndex}`).innerHTML = `
      <button class="vencer perdedor">
        <img src="./img/vencer.png" alt="icone de vitória">
      </button>
      <button class="vencer vencedor">
        <img src="./img/vencer.png" alt="icone de vitória">
      </button>
    `;
  }
  atualizaRanking(jogadores);
}

function start() {
  if (jogadores.length > 1) {
    localStorage.setItem('jogadores', JSON.stringify(jogadores));
    localStorage.setItem('partidas', JSON.stringify(partidas));
    document.querySelector('#caixa-partidas').style =
      'display: grid; margin-bottom: 10px';
    document.querySelector('#caixa-nomes').style = 'display: none';
    document.querySelector('.botoes').style = 'display: none';
    atualizaRanking(jogadores);
    mostraPartidas(partidas);
  } else {
    alert('É necessário pelo menos 2 jogadores.');
  }
}

function atualizaRanking(jogadores) {
  jogadores.sort(function (a, b) {
    return b.pontos - a.pontos;
  });
  document.querySelector('#tabela-ranking').innerHTML = `
    <thead>
      <tr>
        <th>Ranking</th>
      </tr>
    </thead>
    <tbody id="tbody-ranking">
    </tbody>`;
  let html = '';
  for (let i = 0; i < jogadores.length; i++) {
    if (i === 0) {
      html += `
      <tr>
        <td class="ouro">#${i + 1} ${jogadores[i].nome}</td>
        <td class="pontos">${jogadores[i].pontos}</td>
      </tr>
      `;
    } else if (i === 1) {
      html += `
      <tr>
        <td class="prata">#${i + 1} ${jogadores[i].nome}</td>
        <td class="pontos">${jogadores[i].pontos}</td>
      </tr>
      `;
    } else if (i === 2) {
      html += `
      <tr>
        <td class="bronze">#${i + 1} ${jogadores[i].nome}</td>
        <td class="pontos">${jogadores[i].pontos}</td>
      </tr>
      `;
    } else {
      html += `
      <tr>
        <td>#${i + 1} ${jogadores[i].nome}</td>
        <td class="pontos">${jogadores[i].pontos}</td>
      </tr>
      `;
    }
  }

  document.querySelector('#tabela-ranking').innerHTML += html;
}

function load() {
  if (localStorage.getItem('jogadores') && localStorage.getItem('partidas')) {
    jogadores = JSON.parse(localStorage.getItem('jogadores'));
    partidas = JSON.parse(localStorage.getItem('partidas'));
    start();
  }
}
