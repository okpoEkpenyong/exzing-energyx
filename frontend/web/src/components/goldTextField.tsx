import React from "react";
import { TextField, ITextFieldProps, ITextFieldStyles, useTheme } from "@fluentui/react";

/**
 * GoldTextField
 * - Uses Fluent UI TextField but applies a gold border on focus/hover (and subtle glow)
 * - Keeps default styles otherwise
 */
const GoldTextField: React.FC<ITextFieldProps> = (props) => {
  const theme = useTheme();
  const gold = "#bf9b30";

  const styles: Partial<ITextFieldStyles> = {
    // the wrapper around the input; this is where Fluent draws the border
    fieldGroup: {
      borderColor: theme.palette.neutralTertiaryAlt,
      borderWidth: 1,
      borderStyle: "solid",
      borderRadius: 4,
      transition: "border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease",
      // ':focus-within' lets us style when the input inside is focused (keyboard accessible)
      selectors: {
        ":hover": {
          borderColor: gold,
        },
        ":focus-within": {
          borderColor: gold,
          // soft focus ring for keyboard users — rgba alpha for subtlety
          boxShadow: `0 0 0 4px ${hexToRgba(gold, 0.12)}`,
        },
      },
      padding: "6px 8px", // keep comfortable touch target
      background: theme.palette.whiteTranslucent40 ?? undefined,
    },

    // the actual <input> element
    field: {
      selectors: {
        "::placeholder": {
          color: theme.palette.neutralTertiary,
        },
        ":focus": {
          outline: "none", // we use boxShadow on the wrapper instead
        },
      },
      fontSize: 14,
    },

    // label styling (optional)
    // label: {
    //   fontWeight: 600,
    //   marginBottom: 6,
    // },
  };

  // allow consumers to override styles via props.styles
  const mergedStyles = { ...(styles as ITextFieldStyles), ...(props.styles ?? {}) };

  return <TextField {...props} styles={mergedStyles} />;
};

export default GoldTextField;

/* Helper: convert hex to rgba string */
function hexToRgba(hex: string, alpha = 1) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
