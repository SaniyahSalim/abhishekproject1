import { Box, Typography } from '@mui/material'

const Footer = () => {
  return (
    <Box sx={{ textAlign: "center", py: 3, background:"#112D4E" }}>
        <Typography variant="body2" sx={{ color: "white" }}>
          © {new Date().getFullYear()} RiskHealth Analyzer. All rights reserved.
        </Typography>
      </Box>
  )
}

export default Footer