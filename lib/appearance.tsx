import type { Appearance} from "@stripe/stripe-js";

export const stripeAppearance: Appearance = {
    theme: "night",
    variables: {
      colorPrimary: "#111827",
      colorText: "#111827",
      colorBackground: "#ffffff",
      colorDanger: "#ef4444",
      spacingUnit: "3px",
      borderRadius: "5px",
      fontFamily:
        "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    },
    rules: {
      ".Label": { fontWeight: "700", color: "#374151" },
      ".Input": { 
        border: "1px solid #9ca3af", 
        boxShadow: "none",
        fontSize: "20px",
        marginBottom:"5px"
        //lineHeight: "20px",
    },
      ".Input:focus": { borderColor: "#111827", boxShadow: "0 0 0 3px rgba(17,24,39,.15)" },
      ".Input--invalid": { borderColor: "#ef4444" },
      ".Tab, .Block": { border: "1px solid #9ca3af" },
      ".Tab--selected": { borderColor: "#111827" },
    },
  };