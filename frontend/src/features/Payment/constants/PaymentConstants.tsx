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
  .checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  }
      
  .checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
  }
      
  @keyframes stroke {
    100% {
      stroke-dashoffset: 0;
    }
  }
`;