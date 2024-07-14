export function showLoading(parentElement) {
  const loadingIndicator = document.createElement('loading-indicator');
  loadingIndicator.id = 'global-loading-indicator';
  parentElement.appendChild(loadingIndicator);
}

export function hideLoading(parentElement) {
  const loadingIndicator = parentElement.querySelector('#global-loading-indicator');
  if (loadingIndicator) {
    parentElement.removeChild(loadingIndicator);
  }
}