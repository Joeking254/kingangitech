document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('portfolio-grid');

  // Create lightbox elements
  const lightboxOverlay = document.createElement('div');
  lightboxOverlay.id = 'lightbox-overlay';
  lightboxOverlay.style.position = 'fixed';
  lightboxOverlay.style.top = '0';
  lightboxOverlay.style.left = '0';
  lightboxOverlay.style.width = '100vw';
  lightboxOverlay.style.height = '100vh';
  lightboxOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  lightboxOverlay.style.display = 'none';
  lightboxOverlay.style.flexDirection = 'column';
  lightboxOverlay.style.justifyContent = 'center';
  lightboxOverlay.style.alignItems = 'center';
  lightboxOverlay.style.zIndex = '10000';
  lightboxOverlay.style.cursor = 'pointer';
  lightboxOverlay.style.padding = '20px';
  lightboxOverlay.style.boxSizing = 'border-box';

  const lightboxImage = document.createElement('img');
  lightboxImage.id = 'lightbox-image';
  lightboxImage.style.maxWidth = '90%';
  lightboxImage.style.maxHeight = '80%';
  lightboxImage.style.borderRadius = '10px';
  lightboxImage.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.5)';
  lightboxImage.style.marginBottom = '10px';

  const lightboxCaption = document.createElement('div');
  lightboxCaption.id = 'lightbox-caption';
  lightboxCaption.style.color = 'white';
  lightboxCaption.style.fontStyle = 'italic';
  lightboxCaption.style.fontSize = '1.1rem';
  lightboxCaption.style.textAlign = 'center';
  lightboxCaption.style.maxWidth = '90%';
  lightboxCaption.style.textShadow = '0 0 5px rgba(0,0,0,0.7)';

  lightboxOverlay.appendChild(lightboxImage);
  lightboxOverlay.appendChild(lightboxCaption);
  document.body.appendChild(lightboxOverlay);

  lightboxOverlay.addEventListener('click', () => {
    lightboxOverlay.style.display = 'none';
    lightboxImage.src = '';
    lightboxCaption.textContent = '';
  });

  // Add click event to portfolio images
  grid.addEventListener('click', (event) => {
    if (event.target.tagName === 'IMG') {
      lightboxImage.src = event.target.src;
      lightboxCaption.textContent = event.target.alt || '';
      lightboxOverlay.style.display = 'flex';
    }
  });
});
