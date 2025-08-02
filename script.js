// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Special handling for home section - scroll to absolute top
            if (this.getAttribute('href') === '#home') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } 
            else if (this.getAttribute('href') === '#contact') {
                const targetPosition = target.offsetTop - 20; // Smaller offset = scroll down more
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            else {
                // Calculate navbar height dynamically
                const navbar = document.querySelector('.navbar') || document.querySelector('nav') || document.querySelector('header');
                const navbarHeight = navbar ? navbar.offsetHeight : 80; // fallback to 80px
                const targetPosition = target.offsetTop - navbarHeight - 20; // navbar height + small buffer
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===== HEADER BACKGROUND CHANGE ON SCROLL =====
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.85)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.5)';
        header.style.boxShadow = 'none';
    }
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// ===== SERVICE CARDS HOVER EFFECTS =====
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ===== SERVICE CARDS SELECTION =====
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', function() {
        const checkbox = this.querySelector('input[type="checkbox"]');
        checkbox.checked = !checkbox.checked;
        
        if (checkbox.checked) {
            this.classList.add('selected');
        } else {
            this.classList.remove('selected');
        }
    });
});

// ===== FORM SUBMISSION HANDLER =====
// Replace the old handler with AJAX submission to Formspree

document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = this;
    const formData = new FormData(form);

    // Remove all existing 'service[]' from FormData
    formData.delete('service[]');
    // Add checked checkboxes
    document.querySelectorAll('input[name="service[]"]:checked').forEach(checkbox => {
        formData.append('service[]', checkbox.value);
    });
    // Add mobile select if present and not empty
    const mobileService = document.getElementById('mobile-service');
    if (mobileService && mobileService.value && mobileService.value !== '') {
        formData.append('service[]', mobileService.value);
    }

    // Find or create message container
    let messageContainer = form.querySelector('.form-message');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.className = 'form-message';
        form.appendChild(messageContainer);
    }
    messageContainer.textContent = '';

    fetch('https://formspree.io/f/mblkjqqe', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            // alert('Thank you for your message! We\'ll get back to you soon.');
            form.reset();
            messageContainer.textContent = 'Thanks for reaching out!';
        } else {
            // alert('Oops! There was a problem submitting your form.');
            messageContainer.textContent = 'Oops! There was a problem submitting your form.';
        }
    }).catch(error => {
        // alert('Oops! There was a problem submitting your form.');
        messageContainer.textContent = 'Oops! There was a problem submitting your form.';
    });
});

// ===== NEWSLETTER FORM SUBMISSION HANDLER =====
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const form = this;
    const formData = new FormData(form);
    fetch('https://formspree.io/f/xvgqoelj', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        alert('You’re on the list!');
        form.reset();
      } else {
        alert('Oops! There was a problem submitting your subscription.');
      }
    }).catch(error => {
      alert('Oops! There was a problem submitting your subscription.');
    });
  });
}

// ===== MOBILE NAVIGATION =====
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.getElementById('mobileNav');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');

function toggleMobileNav() {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    mobileNavOverlay.classList.toggle('active');
    
    if (mobileNav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeMobileNav() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('active');
    mobileNavOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (hamburger && mobileNav) {
    hamburger.addEventListener('click', toggleMobileNav);
    
    // Close menu on nav link click
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });
    
    // Close menu on overlay click
    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', closeMobileNav);
    }
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMobileNav();
        }
    });
}

// ===== HAMBURGER DISPLAY HANDLER =====
function handleHamburgerDisplay() {
    if (window.innerWidth <= 768) {
        hamburger.style.display = 'flex';
    } else {
        hamburger.style.display = 'none';
        closeMobileNav();
    }
}

window.addEventListener('resize', handleHamburgerDisplay);
window.addEventListener('DOMContentLoaded', handleHamburgerDisplay); 