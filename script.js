document.addEventListener('DOMContentLoaded', function () {
    function getActiveSection() {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) return hash;
        return 'intro';
    }

    function showSection(sectionId) {
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(sectionId);
        if (targetSection) targetSection.classList.add('active');

        document.querySelectorAll('.accordion-title').forEach(title => {
            title.classList.remove('active');
            if (title.getAttribute('data-target') === sectionId) {
                title.classList.add('active');
            }
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.closeMobileMenu();
    }

    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');

    if (hamburger) {
        hamburger.addEventListener('click', function (e) {
            e.stopPropagation();
            if (mobileNav && mobileNav.classList.contains('active')) {
                window.closeMobileMenu();
            } else {
                window.openMobileMenu();
            }
        });
    }

    document.addEventListener('click', function (e) {
        if (hamburger && mobileNav && !hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
            window.closeMobileMenu();
        }
    });

    document.querySelectorAll('.accordion-title').forEach(title => {
        title.addEventListener('click', function (e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-target');
            if (targetSection) {
                window.history.pushState(null, null, '#' + targetSection);
                showSection(targetSection);
            }
        });
    });

    window.addEventListener('popstate', function () {
        showSection(getActiveSection());
    });

    showSection(getActiveSection());
});

function getScrollbarWidth() {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);

    const inner = document.createElement('div');
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
}

document.addEventListener('DOMContentLoaded', function () {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="close-modal">
                <span></span>
                <span></span>
            </div>
            <img class="modal-image" src="" alt="">
        </div>
    `;
    document.body.appendChild(modal);

    const mobileOverlay = document.createElement('div');
    mobileOverlay.className = 'mobile-overlay';
    mobileOverlay.style.display = 'none';
    document.body.appendChild(mobileOverlay);

    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .mobile-overlay {
            display: none;
            position: fixed;
            z-index: 120;
            left: 0; top: 0;
            width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.5);
            animation: fadeIn 0.3s;
        }
        .image-modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0; top: 0;
            width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.8);
            animation: fadeIn 0.3s;
        }
        .modal-content {
            position: relative;
            margin: auto;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%; height: 100%;
            padding: 40px;
        }
        .modal-image {
            max-width: 90%; max-height: 90%;
            object-fit: contain;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .close-modal {
            position: absolute;
            top: 35px; 
            right: 35px;
            color: white; 
            font-size: 40px; 
            font-weight: bold;
            cursor: pointer; 
            z-index: 1001;
            transition: opacity 0.3s;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 20px;
            height: 15px;
        }
        .close-modal span {
            display: block;
            height: 2px;
            width: 100%;
            border-radius: 5px;
            background-color: white;
            transform: rotate(45deg) translate(4px, 5px);
        }
        .close-modal span:nth-child(2) {
            transform: rotate(-45deg) translate(4px, -5px);
        }
        .close-modal:hover { 
            opacity: 0.7; 
        }
        @keyframes fadeIn { from {opacity:0;} to {opacity:1;} }
    `;

    document.head.appendChild(modalStyles);

    window.openMobileMenu = function () {
        const hamburger = document.getElementById('hamburger');
        const mobileNav = document.getElementById('mobile-nav');
        const mobileHeader = document.querySelector('.mobile-header');

        if (mobileHeader && mobileNav) {
            const headerRect = mobileHeader.getBoundingClientRect();
            const headerBottom = headerRect.top + headerRect.height;
            mobileNav.style.top = headerBottom + 'px';
        }

        if (hamburger) hamburger.classList.add('active');
        if (mobileNav) mobileNav.classList.add('active');

        mobileOverlay.style.display = 'block';

        const scrollbarWidth = getScrollbarWidth();
        document.body.style.overflow = 'hidden';
    };

    window.closeMobileMenu = function () {
        const hamburger = document.getElementById('hamburger');
        const mobileNav = document.getElementById('mobile-nav');

        if (hamburger) hamburger.classList.remove('active');
        if (mobileNav) mobileNav.classList.remove('active');

        mobileOverlay.style.display = 'none';

        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0px';
    };

    mobileOverlay.addEventListener('click', () => {
        window.closeMobileMenu();
    });

    const modalImage = modal.querySelector('.modal-image');
    const closeBtn = modal.querySelector('.close-modal');

    function addImageClickListeners() {
        const galleryImages = document.querySelectorAll('.graphic-gallery img, .model-gallery img, .single-column img, .headshot-container img, .kitties-gallery img');
        galleryImages.forEach(img => {
            img.addEventListener('click', function () {
                modal.style.display = 'block';
                modalImage.src = this.src;
                modalImage.alt = this.alt;
                const scrollbarWidth = getScrollbarWidth();
                document.body.style.overflow = 'hidden';
                document.body.style.paddingRight = scrollbarWidth + 'px';
            });
        });
    }
    addImageClickListeners();

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0px';
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
        if (!modalImage.contains(e.target) && e.target !== modalImage) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.style.display === 'block') closeModal();
        if (e.key === 'Escape' && mobileOverlay.style.display === 'block') window.closeMobileMenu();
    });

    document.querySelectorAll('.accordion-title').forEach(title => {
        title.addEventListener('click', function () {
            setTimeout(addImageClickListeners, 100);
        });
    });
});
