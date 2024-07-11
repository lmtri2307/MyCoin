import {Box, Card, CardContent, Divider, Stack, Typography} from "@mui/material";
  
const containerStyle = {
    padding: 1,
};
  
const labelStyle = {
    fontSize: "15px",
    fontWeight: 700,
    marginBottom: "3px",
};
  
const valueStyle = {
    fontSize: "14px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
};
  
export default function BlockCard({no, hash, validator, previousHash, timestamp, handleClick}) {
    return (
      <Card onClick={handleClick} variant="outlined">
        <CardContent>
          <Box sx={containerStyle}>
          <Typography fontWeight={700}>Block {no}</Typography>
          </Box>
          <Divider />
          <Stack spacing={2} sx={containerStyle}>
            <Box>
              <Typography sx={labelStyle}>Hash</Typography>
              <Typography sx={valueStyle} color="limegreen">
                {hash}
              </Typography>
            </Box>
            <Box>
              <Typography sx={labelStyle}>Hash of previous block</Typography>
              <Typography sx={valueStyle} color="deeppink">
                {previousHash}
              </Typography>
            </Box>
          </Stack>
          <Divider />
          <Box sx={containerStyle}>
            <Typography sx={labelStyle}>Validator</Typography>
            <Typography sx={valueStyle} color="text.secondary">
              {validator}
            </Typography>
          </Box>
          <Divider />
          <Box sx={containerStyle}>
            <Typography sx={labelStyle}>Timestamp</Typography>
            <Typography sx={valueStyle} color="text.secondary">
              {timestamp}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
}