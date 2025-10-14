'use strict';



/**
 * COLOR SCHEME CUSTOMIZER
 */

// Predefined color schemes
const colorSchemes = {
  default: {
    primary: '#2d5a3d',
    secondary: '#60a5fa',
    accent: '#f59e0b',
    text: '#1f2937',
    background: '#ffffff'
  },
  ocean: {
    primary: '#0369a1',
    secondary: '#0891b2',
    accent: '#06b6d4',
    text: '#0f172a',
    background: '#f0f9ff'
  },
  sunset: {
    primary: '#dc2626',
    secondary: '#ea580c',
    accent: '#f59e0b',
    text: '#1f2937',
    background: '#fef3c7'
  },
  forest: {
    primary: '#166534',
    secondary: '#16a34a',
    accent: '#84cc16',
    text: '#1f2937',
    background: '#f0fdf4'
  },
  purple: {
    primary: '#7c3aed',
    secondary: '#a855f7',
    accent: '#ec4899',
    text: '#1f2937',
    background: '#faf5ff'
  }
};

// Color scheme customizer functionality
class ColorSchemeCustomizer {
  constructor() {
    this.panel = document.getElementById('colorSchemePanel');
    this.toggleBtn = document.getElementById('colorPanelToggle');
    this.closeBtn = document.getElementById('colorPanelClose');
    this.saveBtn = document.getElementById('saveColors');
    this.resetBtn = document.getElementById('resetColors');
    this.schemeButtons = document.querySelectorAll('.scheme-btn');
    
    // New organized color inputs
    this.colorInputs = {
      // Text & Typography
      text: document.getElementById('textColor'),
      link: document.getElementById('linkColor'),
      heading: document.getElementById('headingColor'),
      
      // Background & Layout
      background: document.getElementById('backgroundColor'),
      header: document.getElementById('headerColor'),
      card: document.getElementById('cardColor'),
      
      // Buttons & Actions
      button: document.getElementById('buttonColor'),
      buttonHover: document.getElementById('buttonHoverColor'),
      buttonActive: document.getElementById('buttonActiveColor'),
      
      // Cards & Components
      cardShadow: document.getElementById('cardShadowColor'),
      cardBorderRadius: document.getElementById('cardBorderRadius'),
      cardShadowIntensity: document.getElementById('cardShadowIntensity'),
      
      // Icons & Accents
      icon: document.getElementById('iconColor'),
      iconHover: document.getElementById('iconHoverColor'),
      accent: document.getElementById('accentColor'),
      secondaryAccent: document.getElementById('secondaryAccent'),
      highlight: document.getElementById('highlightColor'),
      
      // Navigation & Links
      navLink: document.getElementById('navLinkColor'),
      navLinkHover: document.getElementById('navLinkHover'),
      navLinkActive: document.getElementById('navLinkActive'),
      breadcrumb: document.getElementById('breadcrumbColor'),
      
      // Status & Feedback
      success: document.getElementById('successColor'),
      error: document.getElementById('errorColor'),
      warning: document.getElementById('warningColor'),
      info: document.getElementById('infoColor'),
      
      // Borders & Dividers
      border: document.getElementById('borderColor'),
      borderHover: document.getElementById('borderHoverColor'),
      divider: document.getElementById('dividerColor'),
      focus: document.getElementById('focusColor'),
      
      // Labels & Tags
      label: document.getElementById('labelColor'),
      tagBg: document.getElementById('tagBgColor'),
      tagText: document.getElementById('tagTextColor'),
      badge: document.getElementById('badgeColor')
    };

    this.htmlColorInput = document.getElementById('htmlColorInput');
    this.applyHtmlBtn = document.getElementById('applyHtmlColor');

    this.toast = document.getElementById('toast');
    this.toastClose = document.getElementById('toastClose');
    
    this.init();
  }

  init() {
    // Toggle panel
    this.toggleBtn.addEventListener('click', () => {
      this.panel.classList.toggle('open');
    });

    // Close panel
    this.closeBtn.addEventListener('click', () => {
      this.panel.classList.remove('open');
    });

    // Save colors button - only shows toast and closes modal
    this.saveBtn.addEventListener('click', () => {
      this.saveCurrentTheme();
      this.showToast('success', 'Theme Saved!', 'Your color scheme has been applied successfully');
      this.panel.classList.remove('open');
    });

    // Reset colors
    this.resetBtn.addEventListener('click', () => {
      this.resetToDefault();
    });

    // Preset scheme buttons
    this.schemeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const scheme = btn.dataset.scheme;
        this.applyPresetScheme(scheme);
        this.updateActiveButton(btn);
      });
    });

    // Real-time color preview
    Object.values(this.colorInputs).forEach(input => {
      input.addEventListener('input', () => {
        this.previewColors();
      });
    });

    // Load saved colors on page load
    this.loadSavedColors();

    // HTML color input handlers
    this.initHtmlColorInputs();

    // Card styling handlers
    this.initCardStyling();

    // Toast notification handlers
    this.initToastNotifications();
  }

  initHtmlColorInputs() {
    // Single HTML color input handler
    this.applyHtmlBtn.addEventListener('click', () => {
      if (this.htmlColorInput && this.htmlColorInput.value.trim()) {
        const color = this.parseHtmlColor(this.htmlColorInput.value.trim());
        if (color) {
          // Apply to text color by default, user can change manually
          this.colorInputs.text.value = color;
          this.previewColors();
          this.htmlColorInput.style.borderColor = '';
          this.htmlColorInput.value = '';
        } else {
          this.htmlColorInput.style.borderColor = '#e74c3c';
          this.htmlColorInput.placeholder = 'Invalid color code!';
          setTimeout(() => {
            this.htmlColorInput.style.borderColor = '';
            this.htmlColorInput.placeholder = this.htmlColorInput.getAttribute('data-original-placeholder') || '';
          }, 3000);
        }
      }
    });

    // Example color click handlers
    document.querySelectorAll('.example-color').forEach(example => {
      example.addEventListener('click', (e) => {
        const color = e.target.dataset.color;
        this.htmlColorInput.value = color;
        this.htmlColorInput.focus();
      });
    });

    // Enter key support for HTML input
    this.htmlColorInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.applyHtmlBtn.click();
      }
    });

    // Store original placeholder
    this.htmlColorInput.setAttribute('data-original-placeholder', this.htmlColorInput.placeholder);
  }

  applyPresetScheme(schemeName) {
    const scheme = colorSchemes[schemeName];
    if (!scheme) return;

    // Update color inputs
    this.colorInputs.primary.value = scheme.primary;
    this.colorInputs.secondary.value = scheme.secondary;
    this.colorInputs.accent.value = scheme.accent;
    this.colorInputs.text.value = scheme.text;
    this.colorInputs.background.value = scheme.background;

    // Apply colors immediately
    this.applyColors(scheme);
    
    // Save to localStorage
    this.saveColors(scheme);
  }

  applyCustomColors() {
    const colors = {
      primary: this.colorInputs.primary.value,
      secondary: this.colorInputs.secondary.value,
      accent: this.colorInputs.accent.value,
      text: this.colorInputs.text.value,
      background: this.colorInputs.background.value
    };

    this.applyColors(colors);
    this.saveColors(colors);
  }

  previewColors() {
    const colors = {
      // Text & Typography
      text: this.colorInputs.text.value,
      link: this.colorInputs.link.value,
      heading: this.colorInputs.heading.value,
      
      // Background & Layout
      background: this.colorInputs.background.value,
      header: this.colorInputs.header.value,
      card: this.colorInputs.card.value,
      
      // Buttons & Actions
      button: this.colorInputs.button.value,
      buttonHover: this.colorInputs.buttonHover.value,
      buttonActive: this.colorInputs.buttonActive.value,
      
      // Cards & Components
      cardShadow: this.colorInputs.cardShadow.value,
      cardBorderRadius: this.colorInputs.cardBorderRadius.value,
      cardShadowIntensity: this.colorInputs.cardShadowIntensity.value,
      
      // Icons & Accents
      icon: this.colorInputs.icon.value,
      iconHover: this.colorInputs.iconHover.value,
      accent: this.colorInputs.accent.value,
      secondaryAccent: this.colorInputs.secondaryAccent.value,
      highlight: this.colorInputs.highlight.value,
      
      // Navigation & Links
      navLink: this.colorInputs.navLink.value,
      navLinkHover: this.colorInputs.navLinkHover.value,
      navLinkActive: this.colorInputs.navLinkActive.value,
      breadcrumb: this.colorInputs.breadcrumb.value,
      
      // Status & Feedback
      success: this.colorInputs.success.value,
      error: this.colorInputs.error.value,
      warning: this.colorInputs.warning.value,
      info: this.colorInputs.info.value,
      
      // Borders & Dividers
      border: this.colorInputs.border.value,
      borderHover: this.colorInputs.borderHover.value,
      divider: this.colorInputs.divider.value,
      focus: this.colorInputs.focus.value,
      
      // Labels & Tags
      label: this.colorInputs.label.value,
      tagBg: this.colorInputs.tagBg.value,
      tagText: this.colorInputs.tagText.value,
      badge: this.colorInputs.badge.value
    };

    this.applyColors(colors);
  }

  applyColors(colors) {
    const root = document.documentElement;
    
    // Apply text & typography colors
    root.style.setProperty('--text-primary', colors.text);
    root.style.setProperty('--text-secondary', this.lightenColor(colors.text, 30));
    root.style.setProperty('--text-light', this.lightenColor(colors.text, 50));
    root.style.setProperty('--link-color', colors.link);
    root.style.setProperty('--heading-color', colors.heading);
    
    // Apply background & layout colors
    root.style.setProperty('--bg-primary', colors.background);
    root.style.setProperty('--bg-secondary', this.lightenColor(colors.background, 2));
    root.style.setProperty('--bg-tertiary', this.lightenColor(colors.background, 5));
    root.style.setProperty('--header-bg', colors.header);
    root.style.setProperty('--card-bg', colors.card);
    
    // Apply button colors
    root.style.setProperty('--button-color', colors.button);
    root.style.setProperty('--button-hover', colors.buttonHover);
    root.style.setProperty('--button-active', colors.buttonActive);
    
    // Apply icon & accent colors
    root.style.setProperty('--icon-color', colors.icon);
    root.style.setProperty('--icon-hover', colors.iconHover);
    root.style.setProperty('--accent-color', colors.accent);
    root.style.setProperty('--secondary-accent', colors.secondaryAccent);
    root.style.setProperty('--highlight-color', colors.highlight);
    
    // Apply navigation colors
    root.style.setProperty('--nav-link-color', colors.navLink);
    root.style.setProperty('--nav-link-hover', colors.navLinkHover);
    root.style.setProperty('--nav-link-active', colors.navLinkActive);
    root.style.setProperty('--breadcrumb-color', colors.breadcrumb);
    
    // Apply status & feedback colors
    root.style.setProperty('--success-color', colors.success);
    root.style.setProperty('--error-color', colors.error);
    root.style.setProperty('--warning-color', colors.warning);
    root.style.setProperty('--info-color', colors.info);
    
    // Apply border & divider colors
    root.style.setProperty('--border-color', colors.border);
    root.style.setProperty('--border-hover', colors.borderHover);
    root.style.setProperty('--divider-color', colors.divider);
    root.style.setProperty('--focus-color', colors.focus);
    
    // Apply label & tag colors
    root.style.setProperty('--label-color', colors.label);
    root.style.setProperty('--tag-bg', colors.tagBg);
    root.style.setProperty('--tag-text', colors.tagText);
    root.style.setProperty('--badge-color', colors.badge);
    
    // Apply card styling
    this.updateCardStyling();
  }

  resetToDefault() {
    this.applyPresetScheme('default');
    this.updateActiveButton(document.querySelector('[data-scheme="default"]'));
  }

  updateActiveButton(activeBtn) {
    this.schemeButtons.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
  }

  saveColors(colors) {
    localStorage.setItem('customColorScheme', JSON.stringify(colors));
  }

  loadSavedColors() {
    const savedColors = localStorage.getItem('customColorScheme');
    if (savedColors) {
      const colors = JSON.parse(savedColors);
      
      // Update inputs
      this.colorInputs.primary.value = colors.primary;
      this.colorInputs.secondary.value = colors.secondary;
      this.colorInputs.accent.value = colors.accent;
      this.colorInputs.text.value = colors.text;
      this.colorInputs.background.value = colors.background;
      
      // Apply colors
      this.applyColors(colors);
    } else {
      // Apply default scheme
      this.applyPresetScheme('default');
    }
  }

  // Helper functions for color manipulation
  lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
      (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
      (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
  }

  parseHtmlColor(colorString) {
    if (!colorString) return null;

    // Remove any whitespace
    colorString = colorString.trim();

    // Handle hex colors (#FF5733, #ff5733, #F53)
    if (colorString.startsWith('#')) {
      if (colorString.length === 4) {
        // Convert #RGB to #RRGGBB
        const r = colorString[1];
        const g = colorString[2];
        const b = colorString[3];
        colorString = `#${r}${r}${g}${g}${b}${b}`;
      }
      
      if (/^#[0-9A-Fa-f]{6}$/.test(colorString)) {
        return colorString.toUpperCase();
      }
    }

    // Handle rgb() colors (rgb(255,87,51))
    const rgbMatch = colorString.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if (rgbMatch) {
      const r = Math.max(0, Math.min(255, parseInt(rgbMatch[1])));
      const g = Math.max(0, Math.min(255, parseInt(rgbMatch[2])));
      const b = Math.max(0, Math.min(255, parseInt(rgbMatch[3])));
      
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      return hex.toUpperCase();
    }

    // Handle rgba() colors (rgba(255,87,51,0.8))
    const rgbaMatch = colorString.match(/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*[\d.]+\s*\)$/i);
    if (rgbaMatch) {
      const r = Math.max(0, Math.min(255, parseInt(rgbaMatch[1])));
      const g = Math.max(0, Math.min(255, parseInt(rgbaMatch[2])));
      const b = Math.max(0, Math.min(255, parseInt(rgbaMatch[3])));
      
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      return hex.toUpperCase();
    }

    // Handle hsl() colors (hsl(12, 100%, 60%))
    const hslMatch = colorString.match(/^hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/i);
    if (hslMatch) {
      const h = parseInt(hslMatch[1]) / 360;
      const s = parseInt(hslMatch[2]) / 100;
      const l = parseInt(hslMatch[3]) / 100;
      
      const hex = this.hslToHex(h, s, l);
      return hex.toUpperCase();
    }

    // Handle named colors (basic set)
    const namedColors = {
      'red': '#FF0000', 'green': '#008000', 'blue': '#0000FF', 'yellow': '#FFFF00',
      'orange': '#FFA500', 'purple': '#800080', 'pink': '#FFC0CB', 'brown': '#A52A2A',
      'black': '#000000', 'white': '#FFFFFF', 'gray': '#808080', 'grey': '#808080',
      'cyan': '#00FFFF', 'magenta': '#FF00FF', 'lime': '#00FF00', 'navy': '#000080',
      'maroon': '#800000', 'olive': '#808000', 'teal': '#008080', 'silver': '#C0C0C0'
    };

    if (namedColors[colorString.toLowerCase()]) {
      return namedColors[colorString.toLowerCase()];
    }

    return null; // Invalid color format
  }

  hslToHex(h, s, l) {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = (c) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  initCardStyling() {
    // Card background color
    this.cardInputs.background.addEventListener('input', () => {
      this.updateCardStyling();
    });

    // Card shadow color
    this.cardInputs.shadow.addEventListener('input', () => {
      this.updateCardStyling();
    });

    // Border radius slider
    this.cardInputs.borderRadius.addEventListener('input', (e) => {
      document.getElementById('borderRadiusValue').textContent = e.target.value + 'px';
      this.updateCardStyling();
    });

    // Shadow intensity slider
    this.cardInputs.shadowIntensity.addEventListener('input', (e) => {
      document.getElementById('shadowIntensityValue').textContent = e.target.value + 'px';
      this.updateCardStyling();
    });
  }

  updateCardStyling() {
    const cards = document.querySelectorAll('.shop-card, .collection-card, .banner-card, .feature-card, .blog-card, .hero-card');
    const shadowColor = this.colorInputs.cardShadow.value;
    const shadowIntensity = this.colorInputs.cardShadowIntensity.value;
    const borderRadius = this.colorInputs.cardBorderRadius.value;
    const backgroundColor = this.colorInputs.card.value;

    cards.forEach(card => {
      card.style.backgroundColor = backgroundColor;
      card.style.borderRadius = borderRadius + 'px';
      card.style.boxShadow = `0 4px ${shadowIntensity}px rgba(${this.hexToRgb(shadowColor)}, 0.08)`;
      
      // Update hover shadow
      card.style.setProperty('--hover-shadow', `0 8px ${shadowIntensity * 2}px rgba(${this.hexToRgb(shadowColor)}, 0.12)`);
    });

    // Add hover effect CSS
    if (!document.getElementById('cardHoverStyles')) {
      const style = document.createElement('style');
      style.id = 'cardHoverStyles';
      style.textContent = `
        .shop-card:hover, .collection-card:hover, .banner-card:hover, 
        .feature-card:hover, .blog-card:hover, .hero-card:hover {
          box-shadow: var(--hover-shadow) !important;
          transform: translateY(-2px);
        }
      `;
      document.head.appendChild(style);
    }
  }

  saveCurrentTheme() {
    const colors = {
      // Text & Typography
      text: this.colorInputs.text.value,
      link: this.colorInputs.link.value,
      heading: this.colorInputs.heading.value,
      
      // Background & Layout
      background: this.colorInputs.background.value,
      header: this.colorInputs.header.value,
      card: this.colorInputs.card.value,
      
      // Buttons & Actions
      button: this.colorInputs.button.value,
      buttonHover: this.colorInputs.buttonHover.value,
      buttonActive: this.colorInputs.buttonActive.value,
      
      // Cards & Components
      cardShadow: this.colorInputs.cardShadow.value,
      cardBorderRadius: this.colorInputs.cardBorderRadius.value,
      cardShadowIntensity: this.colorInputs.cardShadowIntensity.value,
      
      // Icons & Accents
      icon: this.colorInputs.icon.value,
      iconHover: this.colorInputs.iconHover.value,
      accent: this.colorInputs.accent.value,
      secondaryAccent: this.colorInputs.secondaryAccent.value,
      highlight: this.colorInputs.highlight.value,
      
      // Navigation & Links
      navLink: this.colorInputs.navLink.value,
      navLinkHover: this.colorInputs.navLinkHover.value,
      navLinkActive: this.colorInputs.navLinkActive.value,
      breadcrumb: this.colorInputs.breadcrumb.value,
      
      // Status & Feedback
      success: this.colorInputs.success.value,
      error: this.colorInputs.error.value,
      warning: this.colorInputs.warning.value,
      info: this.colorInputs.info.value,
      
      // Borders & Dividers
      border: this.colorInputs.border.value,
      borderHover: this.colorInputs.borderHover.value,
      divider: this.colorInputs.divider.value,
      focus: this.colorInputs.focus.value,
      
      // Labels & Tags
      label: this.colorInputs.label.value,
      tagBg: this.colorInputs.tagBg.value,
      tagText: this.colorInputs.tagText.value,
      badge: this.colorInputs.badge.value
    };
    
    this.applyColors(colors);
    this.saveColors(colors);
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
      '0, 0, 0';
  }

  initToastNotifications() {
    // Close toast button
    if (this.toastClose) {
      this.toastClose.addEventListener('click', () => {
        this.hideToast();
      });
    }

    // Auto-hide toast after 4 seconds
    if (this.toast) {
      this.toast.addEventListener('transitionend', () => {
        if (this.toast.classList.contains('show')) {
          setTimeout(() => {
            this.hideToast();
          }, 4000);
        }
      });

      // Also close on click outside
      this.toast.addEventListener('click', (e) => {
        if (e.target === this.toast) {
          this.hideToast();
        }
      });
    }
  }

  showToast(type = 'success', title = 'Success!', message = 'Style applied successfully') {
    if (!this.toast) return;

    const toastIcon = this.toast.querySelector('.toast-icon ion-icon');
    const toastTitle = this.toast.querySelector('.toast-title');
    const toastText = this.toast.querySelector('.toast-text');

    // Remove existing type classes
    this.toast.classList.remove('success', 'error', 'warning');
    
    // Add new type class
    this.toast.classList.add(type);

    // Update icon based on type
    if (toastIcon) {
      switch (type) {
        case 'success':
          toastIcon.name = 'checkmark-circle';
          break;
        case 'error':
          toastIcon.name = 'close-circle';
          break;
        case 'warning':
          toastIcon.name = 'warning';
          break;
      }
    }

    // Update content
    if (toastTitle) toastTitle.textContent = title;
    if (toastText) toastText.textContent = message;

    // Show toast
    this.toast.classList.add('show');

    // Auto-hide after 4 seconds
    setTimeout(() => {
      this.hideToast();
    }, 4000);
  }

  hideToast() {
    if (!this.toast) return;
    this.toast.classList.remove('show');
  }
}

// Initialize color scheme customizer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ColorSchemeCustomizer();
});



/**
 * add event on element
 */

const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}



/**
 * navbar toggle
 */

const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
}

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
}

addEventOnElem(navbarLinks, "click", closeNavbar);



/**
 * header sticky & back top btn active
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const headerActive = function () {
  if (window.scrollY > 150) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
}

addEventOnElem(window, "scroll", headerActive);

let lastScrolledPos = 0;

const headerSticky = function () {
  if (lastScrolledPos >= window.scrollY) {
    header.classList.remove("header-hide");
  } else {
    header.classList.add("header-hide");
  }

  lastScrolledPos = window.scrollY;
}

addEventOnElem(window, "scroll", headerSticky);



/**
 * scroll reveal effect - DISABLED
 */

// Scroll reveal effect has been removed
// All sections will be visible by default