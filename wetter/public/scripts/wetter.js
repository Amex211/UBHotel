document.addEventListener('DOMContentLoaded', () => {
  const ortEl = document.getElementById("wetter-ort");
  const tempEl = document.getElementById("wetter-temp");
  const beschrEl = document.getElementById("wetter-beschreibung");
  const iconEl = document.getElementById("wetter-icon");
  const widgetEl = document.querySelector(".wetter-widget");

  let isLoading = false;

  // Add smooth transitions between weather changes
  function updateWeatherWithAnimation(data) {
    if (isLoading) return;
    
    isLoading = true;
    widgetEl.classList.add('loading');

    // Fade out current content
    [ortEl, tempEl, beschrEl, iconEl].forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
    });

    setTimeout(() => {
      // Update content
      ortEl.textContent = data.ort;
      tempEl.textContent = data.temperatur;
      beschrEl.textContent = data.beschreibung;
      iconEl.src = data.icon;
      iconEl.alt = data.beschreibung;

      // Animate background based on weather
      updateBackgroundForWeather(data.beschreibung);

      // Fade in new content
      setTimeout(() => {
        [ortEl, tempEl, beschrEl, iconEl].forEach((el, index) => {
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, index * 100);
        });

        widgetEl.classList.remove('loading');
        isLoading = false;
      }, 100);
    }, 300);
  }

  // Dynamic background based on weather condition
  function updateBackgroundForWeather(beschreibung) {
    const page = document.querySelector('.wetter-page');
    
    // Remove existing weather classes
    page.classList.remove('sunny', 'cloudy', 'rainy', 'stormy');
    
    // Add appropriate class based on weather
    if (beschreibung.toLowerCase().includes('sonnig')) {
      page.classList.add('sunny');
      page.style.background = 'linear-gradient(135deg, #74b9ff 0%, #fdcb6e 50%, #fd79a8 100%)';
    } else if (beschreibung.toLowerCase().includes('regen')) {
      page.classList.add('rainy');
      page.style.background = 'linear-gradient(135deg, #636e72 0%, #2d3436 50%, #74b9ff 100%)';
    } else if (beschreibung.toLowerCase().includes('bewölkt')) {
      page.classList.add('cloudy');
      page.style.background = 'linear-gradient(135deg, #ddd 0%, #74b9ff 50%, #0984e3 100%)';
    } else {
      page.style.background = 'linear-gradient(135deg, #74b9ff 0%, #0984e3 50%, #6c5ce7 100%)';
    }
  }

  // Add ripple effect on widget click
  function createRipple(event) {
    const widget = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = widget.getBoundingClientRect();
    const radius = Math.max(rect.width, rect.height);
    const left = event.clientX - rect.left - radius / 2;
    const top = event.clientY - rect.top - radius / 2;

    ripple.style.width = ripple.style.height = radius + 'px';
    ripple.style.left = left + 'px';
    ripple.style.top = top + 'px';
    ripple.classList.add('ripple');

    const existingRipple = widget.querySelector('.ripple');
    if (existingRipple) {
      existingRipple.remove();
    }

    widget.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // Add ripple styles
  const style = document.createElement('style');
  style.textContent = `
    .wetter-widget {
      position: relative;
      overflow: hidden;
    }
    
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple-animation 0.6s ease-out;
      pointer-events: none;
    }
    
    @keyframes ripple-animation {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Add click handler for ripple effect
  widgetEl.addEventListener('click', createRipple);

  // Enhanced error handling
  async function ladeWetter() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch('/wetter/api/wetter', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      // Validate data structure
      if (!data || !data.ort || !data.temperatur || !data.beschreibung) {
        throw new Error('Invalid weather data structure');
      }

      updateWeatherWithAnimation(data);

      // Show success indicator
      showStatusIndicator('success');

    } catch (err) {
      console.error("Fehler beim Laden der Wetterdaten", err);
      
      // Show error indicator
      showStatusIndicator('error');
      
      // Fallback data
      const fallbackData = {
        ort: "Esslingen",
        temperatur: "--°C",
        beschreibung: "Daten nicht verfügbar",
        icon: "/wetter/images/cloudy.svg"
      };
      
      updateWeatherWithAnimation(fallbackData);
    }
  }

  // Status indicator for feedback
  function showStatusIndicator(type) {
    const existing = document.querySelector('.status-indicator');
    if (existing) existing.remove();

    const indicator = document.createElement('div');
    indicator.className = `status-indicator ${type}`;
    indicator.innerHTML = type === 'success' ? '✓' : '!';
    
    const indicatorStyles = `
      .status-indicator {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: statusSlideIn 0.3s ease-out;
      }
      
      .status-indicator.success {
        background: #00b894;
      }
      
      .status-indicator.error {
        background: #e17055;
      }
      
      @keyframes statusSlideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    
    if (!document.querySelector('style[data-status-styles]')) {
      const statusStyle = document.createElement('style');
      statusStyle.setAttribute('data-status-styles', 'true');
      statusStyle.textContent = indicatorStyles;
      document.head.appendChild(statusStyle);
    }

    document.body.appendChild(indicator);
    
    setTimeout(() => {
      indicator.style.opacity = '0';
      indicator.style.transform = 'translateX(100%)';
      setTimeout(() => indicator.remove(), 300);
    }, 2000);
  }

  // Add smooth transitions to elements
  [ortEl, tempEl, beschrEl, iconEl].forEach(el => {
    el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });

  // Initial load
  ladeWetter();
  
  // Set up auto-refresh with exponential backoff on errors
  let retryCount = 0;
  const maxRetries = 3;
  
  function scheduleNextUpdate() {
    const baseInterval = 10000; // 10 seconds
    const interval = retryCount > 0 ? baseInterval * Math.pow(2, retryCount) : baseInterval;
    
    setTimeout(() => {
      ladeWetter().then(() => {
        retryCount = 0; // Reset on success
        scheduleNextUpdate();
      }).catch(() => {
        retryCount = Math.min(retryCount + 1, maxRetries);
        scheduleNextUpdate();
      });
    }, interval);
  }
  
  scheduleNextUpdate();

  // Add keyboard accessibility
  widgetEl.setAttribute('tabindex', '0');
  widgetEl.setAttribute('role', 'button');
  widgetEl.setAttribute('aria-label', 'Wetterdaten aktualisieren');
  
  widgetEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      ladeWetter();
    }
  });
});