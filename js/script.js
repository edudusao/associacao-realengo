/* =========================================================
   Associação de Moradores de Realengo
   Script principal - interatividade e validação
   Atividade Extensionista II - UNINTER
   ========================================================= */

(function () {
  'use strict';

  /* =======================================================
     1. MENU RESPONSIVO
     ======================================================= */
  var menuToggle = document.getElementById('menu-toggle');
  var menuLista  = document.getElementById('menu-principal');

  if (menuToggle && menuLista) {
    menuToggle.addEventListener('click', function () {
      var aberto = menuLista.classList.toggle('aberto');
      menuToggle.setAttribute('aria-expanded', String(aberto));
      menuToggle.setAttribute('aria-label', aberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    });

    // Fecha o menu ao clicar em um link (navegação por âncora no celular)
    menuLista.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && menuLista.classList.contains('aberto')) {
        menuLista.classList.remove('aberto');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* =======================================================
     2. ACESSIBILIDADE - TAMANHO DA FONTE E ALTO CONTRASTE
     ======================================================= */
  var TAMANHO_BASE = 17;   // px
  var TAMANHO_MIN  = 15;
  var TAMANHO_MAX  = 24;
  var tamanhoAtual = TAMANHO_BASE;

  function aplicarTamanho(valor) {
    tamanhoAtual = Math.min(TAMANHO_MAX, Math.max(TAMANHO_MIN, valor));
    document.body.style.fontSize = tamanhoAtual + 'px';
  }

  var btnAumentar  = document.getElementById('btn-aumentar');
  var btnDiminuir  = document.getElementById('btn-diminuir');
  var btnNormal    = document.getElementById('btn-normal');
  var btnContraste = document.getElementById('btn-contraste');

  if (btnAumentar) btnAumentar.addEventListener('click', function () { aplicarTamanho(tamanhoAtual + 2); });
  if (btnDiminuir) btnDiminuir.addEventListener('click', function () { aplicarTamanho(tamanhoAtual - 2); });
  if (btnNormal)   btnNormal.addEventListener('click',   function () { aplicarTamanho(TAMANHO_BASE); });

  if (btnContraste) {
    btnContraste.addEventListener('click', function () {
      var ativo = document.body.classList.toggle('alto-contraste');
      btnContraste.setAttribute('aria-pressed', String(ativo));
    });
  }

  /* =======================================================
     3. BOTÃO VOLTAR AO TOPO
     ======================================================= */
  var btnTopo = document.getElementById('voltar-topo');

  if (btnTopo) {
    window.addEventListener('scroll', function () {
      btnTopo.classList.toggle('visivel', window.scrollY > 400);
    });
    btnTopo.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.querySelector('.skip-link').focus();
    });
  }

  /* =======================================================
     4. MÁSCARA DE TELEFONE
     ======================================================= */
  var campoTelefone = document.getElementById('telefone');

  if (campoTelefone) {
    campoTelefone.addEventListener('input', function () {
      var digitos = this.value.replace(/\D/g, '').slice(0, 11);
      var saida = '';
      if (digitos.length > 0) saida = '(' + digitos.slice(0, 2);
      if (digitos.length >= 3) saida += ') ' + digitos.slice(2, digitos.length > 10 ? 7 : 6);
      if (digitos.length > (digitos.length > 10 ? 7 : 6)) {
        saida += '-' + digitos.slice(digitos.length > 10 ? 7 : 6);
      }
      this.value = saida;
    });
  }

  /* =======================================================
     5. CONTADOR DE CARACTERES DA MENSAGEM
     ======================================================= */
  var campoMensagem = document.getElementById('mensagem');
  var contador      = document.getElementById('contador-mensagem');

  if (campoMensagem && contador) {
    campoMensagem.addEventListener('input', function () {
      contador.textContent = this.value.length + ' de 600 caracteres';
    });
  }

  /* =======================================================
     6. VALIDAÇÃO DO FORMULÁRIO DE CONTATO
     ======================================================= */
  var form = document.getElementById('form-contato');
  if (!form) return;

  var retorno = document.getElementById('retorno-form');

  function definirErro(idCampo, mensagem) {
    var campo = document.getElementById(idCampo);
    var spanErro = document.getElementById('erro-' + idCampo);
    var wrapper = campo.closest('.campo');

    if (mensagem) {
      spanErro.textContent = mensagem;
      wrapper.classList.add('invalido');
      campo.setAttribute('aria-invalid', 'true');
      return false;
    }
    spanErro.textContent = '';
    wrapper.classList.remove('invalido');
    campo.removeAttribute('aria-invalid');
    return true;
  }

  function validarNome() {
    var valor = document.getElementById('nome').value.trim();
    if (valor === '')        return definirErro('nome', 'Informe seu nome completo.');
    if (valor.length < 3)    return definirErro('nome', 'O nome deve ter pelo menos 3 caracteres.');
    if (valor.indexOf(' ') === -1) return definirErro('nome', 'Informe o nome e o sobrenome.');
    return definirErro('nome', '');
  }

  function validarEmail() {
    var valor = document.getElementById('email').value.trim();
    var padrao = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
    if (valor === '')        return definirErro('email', 'Informe seu e-mail.');
    if (!padrao.test(valor)) return definirErro('email', 'Digite um e-mail válido. Exemplo: nome@email.com');
    return definirErro('email', '');
  }

  function validarTelefone() {
    var valor = document.getElementById('telefone').value.trim();
    if (valor === '') return definirErro('telefone', ''); // campo opcional
    var digitos = valor.replace(/\D/g, '');
    if (digitos.length < 10) return definirErro('telefone', 'Telefone incompleto. Inclua o DDD.');
    return definirErro('telefone', '');
  }

  function validarAssunto() {
    var valor = document.getElementById('assunto').value;
    if (valor === '') return definirErro('assunto', 'Selecione o assunto da mensagem.');
    return definirErro('assunto', '');
  }

  function validarMensagem() {
    var valor = document.getElementById('mensagem').value.trim();
    if (valor === '')     return definirErro('mensagem', 'Escreva sua mensagem.');
    if (valor.length < 10) return definirErro('mensagem', 'A mensagem deve ter pelo menos 10 caracteres.');
    return definirErro('mensagem', '');
  }

  // Validação em tempo real (ao sair do campo)
  document.getElementById('nome').addEventListener('blur', validarNome);
  document.getElementById('email').addEventListener('blur', validarEmail);
  document.getElementById('telefone').addEventListener('blur', validarTelefone);
  document.getElementById('assunto').addEventListener('change', validarAssunto);
  document.getElementById('mensagem').addEventListener('blur', validarMensagem);

  form.addEventListener('submit', function (evento) {
    evento.preventDefault();

    var resultados = [
      validarNome(),
      validarEmail(),
      validarTelefone(),
      validarAssunto(),
      validarMensagem()
    ];

    var tudoValido = resultados.every(function (r) { return r === true; });

    if (!tudoValido) {
      retorno.className = 'retorno falha';
      retorno.textContent = 'Não foi possível enviar. Verifique os campos destacados em vermelho.';
      // Move o foco para o primeiro campo com erro (acessibilidade por teclado)
      var primeiroInvalido = form.querySelector('.campo.invalido input, .campo.invalido select, .campo.invalido textarea');
      if (primeiroInvalido) primeiroInvalido.focus();
      return;
    }

    var dados = {
      nome:     document.getElementById('nome').value.trim(),
      email:    document.getElementById('email').value.trim(),
      telefone: document.getElementById('telefone').value.trim(),
      assunto:  document.getElementById('assunto').value,
      mensagem: document.getElementById('mensagem').value.trim(),
      enviadoEm: new Date().toISOString()
    };

    // Protocolo simples para o morador acompanhar a solicitação
    var protocolo = 'AMR-' + new Date().getFullYear() + '-' +
                    String(Date.now()).slice(-6);

    retorno.className = 'retorno sucesso';
    retorno.textContent = 'Mensagem enviada com sucesso, ' + dados.nome.split(' ')[0] +
                          '! Seu número de protocolo é ' + protocolo +
                          '. A associação responderá pelo e-mail informado.';

    // Registro no console para conferência durante os testes
    console.log('Mensagem registrada:', dados, 'Protocolo:', protocolo);

    form.reset();
    if (contador) contador.textContent = '0 de 600 caracteres';
    retorno.focus();
  });

})();
