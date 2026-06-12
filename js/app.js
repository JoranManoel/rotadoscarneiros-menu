const container = document.getElementById('containerProdutos');

const menuCategorias =
    document.getElementById('menuCategorias');

const skeletonContainer =
    document.getElementById('skeletonContainer');

fetch('data/cardapio.json')

    .then(response => response.json())

    .then(data => {

        skeletonContainer.style.display = 'none';

        const limiteMenu = 5;
        const categoriasOcultas = [];

        data.categorias.forEach((categoria, index) => {

            // ID DA CATEGORIA
            const categoriaId = categoria.nome
                .toLowerCase()
                .replace(/\s/g, '-');

            // MENU
            const li = document.createElement('li');

            li.innerHTML = `
                            <div>
                                <h2>${categoria.icone}</h2>
                            </div>

                            <small>${categoria.nome}</small>
                        `;

            li.setAttribute('data-target', categoriaId);

            if (index >= limiteMenu) {
                li.style.display = 'none';
                categoriasOcultas.push(li);
            }

            // CLICK MENU
            li.addEventListener('click', () => {

                // REMOVE ACTIVE
                document.querySelectorAll('.sidebar li')
                    .forEach(item => {
                        item.classList.remove('active');
                    });

                // ADD ACTIVE
                li.classList.add('active');

                // SCROLL
                document.querySelector(`#${categoriaId}`)
                    .scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

            });

            menuCategorias.appendChild(li);

            // SECTION
            const section = document.createElement('section');

            section.classList.add('categoria');

            section.id = categoriaId;

            section.innerHTML = `

            <h2>${categoria.nome}</h2>
            <div class="cards-wrapper">

            <div class="fade-left"></div>
            <div class="fade-right"></div>

            <div class="cards">

                ${categoria.itens.map(item => `

                <div class="card"

                    data-nome="${item.nome}"
                    data-descricao="${item.descricao}"
                    data-preco="${item.preco}"
                    data-imagem="${item.imagem}"
                    data-badge="${item.badge || ''}"

                    style="animation-delay:${Math.random() * 0.5}s">

                    ${item.badge ? `
                        <div class="badge">
                        ${item.badge}
                        </div>
                    ` : ''}

                    <img src="${item.imagem}" alt="${item.nome}">

                    <div class="card-content">

                        <h3>${item.nome}</h3>
                        <p>${item.descricao}</p>
                        <div class="preco">
                            ${item.preco}
                        </div>

                    </div>

                </div>

            `).join('')}

            </div>
        </div>

      `;

            container.appendChild(section);

        });


        // =======================
        // BOTÃO MAIS
        // =======================

        if (categoriasOcultas.length > 0) {

            const btnMais = document.createElement('li');

            btnMais.innerHTML = `
                                <div>
                                    <h2><i class="fa-solid fa-angle-down"></i></h2>
                                </div>
                                <small>Mais</small>
                            `;

            let aberto = false;

            btnMais.addEventListener('click', () => {

                aberto = !aberto;

                categoriasOcultas.forEach(item => {

                    item.style.display =
                        aberto ? 'flex' : 'none';

                });

                btnMais.querySelector('small').innerText =
                    aberto ? 'Menos' : 'Mais';
                btnMais.querySelector('i').classList.toggle('fa-angle-up', aberto);
                btnMais.querySelector('i').classList.toggle('fa-angle-down', !aberto);

            });

            menuCategorias.appendChild(btnMais);

        }


        // =========================
        // OBSERVER
        // =========================

        const sections =
            document.querySelectorAll('.categoria');

        const observer =
            new IntersectionObserver((entries) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        const id = entry.target.id;

                        // REMOVE ACTIVE
                        document.querySelectorAll('.sidebar li')
                            .forEach(li => {
                                li.classList.remove('active');
                            });

                        // ADD ACTIVE
                        const activeItem =
                            document.querySelector(
                                `.sidebar li[data-target="${id}"]`
                            );

                        if (activeItem) {
                            activeItem.classList.add('active');
                        }

                    }

                });

            }, {
                threshold: 0.3
            });

        // OBSERVA SECTIONS
        sections.forEach(section => {
            observer.observe(section);
        });


        // =======================
        // FADES DOS CARDS
        // =======================
        const allCards = document.querySelectorAll('.cards-wrapper .cards');

        allCards.forEach(cards => {

            const wrapper = cards.closest('.cards-wrapper');

            function updateFade() {

                if (cards.scrollLeft > 5) {
                    wrapper.classList.add('scrolled-left');
                } else {
                    wrapper.classList.remove('scrolled-left');
                }

                const maxScroll =
                    cards.scrollWidth - cards.clientWidth;

                if (cards.scrollLeft >= maxScroll - 5) {
                    wrapper.classList.add('end-scroll');
                } else {
                    wrapper.classList.remove('end-scroll');
                }

            }

            updateFade();

            cards.addEventListener(
                'scroll',
                updateFade
            );

        });

    });

// =========================
// MODAL
// =========================
const modal = document.getElementById('modal');

const modalImg = document.getElementById('modalImg');

const modalTitle = document.getElementById('modalTitle');

const modalDescription = document.getElementById('modalDescription');

const modalPrice = document.getElementById('modalPrice');

const modalBadge = document.getElementById('modalBadge');

const closeModal = document.querySelector('.close-modal');

// ABRIR MODAL
document.addEventListener('click', (e) => {

    const card = e.target.closest('.card');

    if (!card) return;

    modalImg.src = card.dataset.imagem;

    modalTitle.innerText = card.dataset.nome;

    modalDescription.innerText = card.dataset.descricao;

    modalPrice.innerText = card.dataset.preco;

    if (card.dataset.badge) {

        modalBadge.style.display = 'inline-flex';

        modalBadge.innerText = card.dataset.badge;

    } else {

        modalBadge.style.display ='none';

    }

    modal.classList.add('show');

    document.body.style.overflow = 'hidden';

    document.body.classList.add('modal-open');

});

// FECHAR
function fecharModal() {

    modal.classList.remove('show');

    document.body.style.overflow = 'auto';

    document.body.classList.remove('modal-open');

}

closeModal.addEventListener(
    'click',
    fecharModal
);

// FECHAR AO CLICAR FORA
modal.addEventListener('click', (e) => {

    if (
        e.target.classList.contains('modal')
        ||
        e.target.classList.contains('modal-overlay')
    ) {

        fecharModal();

    }

});

// ESC
document.addEventListener('keydown', (e) => {

    if (e.key === 'Escape') {

        fecharModal();

    }

});

// =========================
// MOBILE NAV
// =========================
const mobileButtons = document.querySelectorAll('.mobile-nav button');

mobileButtons.forEach(button => {

    button.addEventListener('click', () => {

        mobileButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        button.classList.add('active');

        const target = button.getAttribute('data-target');

        const section = document.getElementById(target);

        if (section) {

            section.scrollIntoView({
                behavior: 'smooth'
            });

        }

    });

});