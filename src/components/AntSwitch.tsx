import Switch from "@mui/material/Switch"
import { styled } from "@mui/material/styles"

export const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "var(--grey-1100)",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "var(--color-success)",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgba(0, 35, 11, 0.2)",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "var(--grey-100)",
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: "var(--grey-700)",
    boxSizing: "border-box",
    border: "1px solid var(--stroke-low)",
  },
}))
