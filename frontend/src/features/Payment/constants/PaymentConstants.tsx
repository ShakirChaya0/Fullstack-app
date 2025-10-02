export const printStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inconsolata:wght@400;600&display=swap');
  
  body {
    font-family: 'Inter', sans-serif;
  }
  .font-mono {
    font-family: 'Inconsolata', monospace;
  }
  @media print {
    .no-print {
      display: none;
    }
    body {
      background-color: #fff !important;
    }
    .print-container {
      box-shadow: none;
      margin: 0;
      max-width: 100%;
      border: 1px solid #ccc;
    }
  }
`;

export const animationStyles = `
  @keyframes blink {
      0%, 100% { opacity: 0.2; }
      50% { opacity: 1; }
  }
  .blinking-dots span {
      animation: blink 1.4s infinite;
      display: inline-block;
  }
  .blinking-dots span:nth-child(2) {
      animation-delay: 0.2s;
  }
  .blinking-dots span:nth-child(3) {
      animation-delay: 0.4s;
  }
`;