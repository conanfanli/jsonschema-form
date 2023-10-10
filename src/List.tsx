import { Box, Collapse } from "@mui/material";
import React from "react";

export function ListRows({ show }: { show: boolean }) {
  return (
    <Collapse in={show}>
      <Box noValidate component="form">
        <div>hi</div>
      </Box>
    </Collapse>
  );
}
