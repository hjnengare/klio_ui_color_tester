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
    this.applyBtn = document.getElementById('applyColors');
    this.resetBtn = document.getElementById('resetColors');
    this.schemeButtons = document.querySelectorAll('.scheme-btn');
    this.colorInputs = {
      primary: document.getElementById('primaryColor'),
      secondary: document.getElementById('secondaryColor'),
      accent: document.getElementById('accentColor'),
      text: document.getElementById('textColor'),
      background: document.getElementById('backgroundColor')
    };
    
    this.htmlColorInputs = {
      primary: document.getElementById('htmlPrimaryColor'),
      secondary: document.getElementById('htmlSecondaryColor'),
      accent: document.getElementById('htmlAccentColor'),
      text: document.getElementById('htmlTextColor'),
      background: document.getElementById('htmlBackgroundColor')
    };
    
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

    // Apply colors
    this.applyBtn.addEventListener('click', () => {
      this.applyCustomColors();
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
  }

  initHtmlColorInputs() {
    // Apply buttons for HTML color inputs
    document.querySelectorAll('.apply-html-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.target.dataset.target;
        const inputId = `html${target.charAt(0).toUpperCase() + target.slice(1)}Color`;
        const htmlInput = document.getElementById(inputId);
        const colorInput = this.colorInputs[target];
        
        if (htmlInput && htmlInput.value.trim()) {
          const color = this.parseHtmlColor(htmlInput.value.trim());
          if (color) {
            colorInput.value = color;
            this.previewColors();
            htmlInput.style.borderColor = '';
            htmlInput.value = ''; // Clear after successful application
          } else {
            htmlInput.style.borderColor = '#e74c3c';
            htmlInput.placeholder = 'Invalid color code!';
            setTimeout(() => {
              htmlInput.style.borderColor = '';
              htmlInput.placeholder = htmlInput.getAttribute('data-original-placeholder') || '';
            }, 3000);
          }
        }
      });
    });

    // Example color click handlers
    document.querySelectorAll('.example-color').forEach(example => {
      example.addEventListener('click', (e) => {
        const color = e.target.dataset.color;
        const targetInput = this.htmlColorInputs.primary; // Default to primary
        targetInput.value = color;
        targetInput.focus();
      });
    });

    // Enter key support for HTML inputs
    Object.values(this.htmlColorInputs).forEach(input => {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const target = input.id.replace('html', '').replace('Color', '').toLowerCase();
          const applyBtn = document.querySelector(`[data-target="${target}Color"]`);
          if (applyBtn) {
            applyBtn.click();
          }
        }
      });

      // Store original placeholder
      input.setAttribute('data-original-placeholder', input.placeholder);
    });
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
      primary: this.colorInputs.primary.value,
      secondary: this.colorInputs.secondary.value,
      accent: this.colorInputs.accent.value,
      text: this.colorInputs.text.value,
      background: this.colorInputs.background.value
    };

    this.applyColors(colors);
  }

  applyColors(colors) {
    const root = document.documentElement;
    
    // Apply primary colors with variations
    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--primary-color-light', this.lightenColor(colors.primary, 20));
    root.style.setProperty('--primary-color-dark', this.darkenColor(colors.primary, 20));
    
    // Apply secondary colors with variations
    root.style.setProperty('--secondary-color', colors.secondary);
    root.style.setProperty('--secondary-color-light', this.lightenColor(colors.secondary, 20));
    root.style.setProperty('--secondary-color-dark', this.darkenColor(colors.secondary, 20));
    
    // Apply accent colors with variations
    root.style.setProperty('--accent-color', colors.accent);
    root.style.setProperty('--accent-color-light', this.lightenColor(colors.accent, 20));
    root.style.setProperty('--accent-color-dark', this.darkenColor(colors.accent, 20));
    
    // Apply text colors
    root.style.setProperty('--text-primary', colors.text);
    root.style.setProperty('--text-secondary', this.lightenColor(colors.text, 30));
    root.style.setProperty('--text-light', this.lightenColor(colors.text, 50));
    
    // Apply background colors
    root.style.setProperty('--bg-primary', colors.background);
    root.style.setProperty('--bg-secondary', this.lightenColor(colors.background, 2));
    root.style.setProperty('--bg-tertiary', this.lightenColor(colors.background, 5));
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