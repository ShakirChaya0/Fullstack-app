import { StyleSheet } from "@react-pdf/renderer";

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

export const pdfStyles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    padding: 24,
    lineHeight: 1.4,
    flexDirection: "column",
    color: "#1f2937",
  },
  container: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    textAlign: "center",
    borderBottomWidth: 1,
    borderStyle: "dashed",
    borderColor: "#cbd5e1",
    paddingBottom: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 10,
    marginTop: 2,
    color: "#475569", 
  },
  section: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderStyle: "dashed",
    borderColor: "#cbd5e1",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontWeight: "bold",
    fontSize: 10,
  },
  value: {
    fontFamily: "Courier",
    fontSize: 10,
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontFamily: "Courier",
    marginBottom: 6,
  },
  productInfo: {
    flexDirection: "column",
    maxWidth: "70%",
  },
  productName: {
    fontSize: 11,
    fontWeight: "bold",
  },
  productDetail: {
    fontSize: 9,
    color: "#64748b",
  },
  totalSection: {
    borderTopWidth: 1,
    borderColor: "#cbd5e1",
    paddingTop: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
  },
  footer: {
    textAlign: "center",
    marginTop: 16,
    borderTopWidth: 1,
    borderColor: "#e2e8f0",
    paddingTop: 8,
  },
  thanks: {
    fontSize: 12,
    fontWeight: "bold",
  },
  legal: {
    fontSize: 9,
    marginTop: 4,
    color: "#64748b",
  },
});

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