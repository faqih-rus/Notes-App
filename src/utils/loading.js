export function showLoading() {
  const loadingIndicator = document.querySelector('loading-indicator');
  if (loadingIndicator) {
    loadingIndicator.style.display = 'flex';
  }
}

export function hideLoading() {
  const loadingIndicator = document.querySelector('loading-indicator');
  if (loadingIndicator) {
    loadingIndicator.style.display = 'none';
  }
}
