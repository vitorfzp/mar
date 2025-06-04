document.addEventListener('DOMContentLoaded', function() {

    // Atualiza o ano no rodapé
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Animação de entrada ao rolar a página (Scroll Animation)
    const timelineContainers = document.querySelectorAll('.timeline-container');

    if (typeof IntersectionObserver !== 'undefined') {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px', // Aciona um pouco antes do elemento estar totalmente visível
            threshold: 0.1 // 10% do elemento visível
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Para de observar após animação
                }
            });
        };

        const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
        timelineContainers.forEach(container => {
            scrollObserver.observe(container);
        });
    } else {
        // Fallback para navegadores sem IntersectionObserver: torna todos visíveis
        timelineContainers.forEach(container => {
            container.classList.add('is-visible');
        });
    }

    // --- LÓGICA DO MODAL ---

    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImg = document.getElementById('modal-img');
    const modalDescription = document.getElementById('modal-description');
    const closeModalButton = modal.querySelector('.close-button');
    const timelineDots = document.querySelectorAll('.timeline-dot');

    function openModal(timelineItemContainer) {
        if (!timelineItemContainer || !modal || !modalTitle || !modalImg || !modalDescription) {
            console.error('Elementos do modal ou item da timeline não encontrados.');
            return;
        }

        const title = timelineItemContainer.dataset.title || timelineItemContainer.querySelector('h2')?.textContent || 'Detalhes';
        const imageElement = timelineItemContainer.querySelector('.image-container img');
        const imgSrc = imageElement ? imageElement.src : 'img/placeholder.png'; // Use um placeholder se a imagem não existir
        const imgAlt = imageElement ? imageElement.alt : title;
        
        const descriptionParagraphs = timelineItemContainer.querySelectorAll('.text-content p');
        let descriptionHTML = '';
        descriptionParagraphs.forEach(p => {
            descriptionHTML += `<p>${p.innerHTML}</p>`;
        });

        modalTitle.textContent = title;
        modalImg.src = imgSrc;
        modalImg.alt = imgAlt;
        modalDescription.innerHTML = descriptionHTML || '<p>Nenhuma descrição disponível.</p>';

        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Impede scroll do body
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restaura scroll do body
        }
    }

    timelineDots.forEach(dot => {
        dot.addEventListener('click', function() {
            const parentContainer = this.closest('.timeline-container');
            openModal(parentContainer);
        });
    });

    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) { // Clique no backdrop
                closeModal();
            }
        });
    }
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });
});