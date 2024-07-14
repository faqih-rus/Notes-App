class LoadingIndicator extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <style>
          .loading-outer {
            display: flex;
            justify-content: center;
            align-items: center;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.8);
            z-index: 9999;
          }
          .loading-inner {
            border: 4px solid #f3f3f3;
            border-radius: 50%;
            border-top: 4px solid #3498db;
            width: 40px;
            height: 40px;
            -webkit-animation: spin 2s linear infinite;
            animation: spin 2s linear infinite;
          }
          @-webkit-keyframes spin {
            0% { -webkit-transform: rotate(0deg); }
            100% { -webkit-transform: rotate(360deg); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
        <div class="loading-outer">
          <div class="loading-inner"></div>
        </div>
      `;
    }
  }
  
  if (!customElements.get('loading-indicator')) {
    customElements.define('loading-indicator', LoadingIndicator);
  }
  export default LoadingIndicator;
  