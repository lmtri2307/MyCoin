import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
  } from "@mui/material";
  
  const cardStyle = {
    height: "160px",
    border: "1px solid rgb(215, 218, 227)",
    borderRadius: "10px",
    textTransform: "capitalize",
    boxShadow: "none",
  };
  
  const cardActionAreaStyle = {
    height: "100%",
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    padding: "0 20px",
  
    "&:hover, &:focus": {
      backgroundColor: "rgba(242, 243, 246, .08)",
    },
  };
  
  const cardMediaStyle = {
    width: "64px",
    height: "64px",
    margin: "0 16px",
  };
  
  const cardContentStyle = {
    maxWidth: "406px",
    padding: 0,
    textAlign: "start",
    textTransform: "capitalize",
  };


  export default function ModalSelectionCard({imagePath,imageAlt,title,description,onClick,}) {
    return (
      <Card sx={cardStyle}>
        <CardActionArea sx={cardActionAreaStyle} onClick={onClick}>
          <CardMedia
            sx={cardMediaStyle}
            component="img"
            image={imagePath}
            alt={imageAlt}/>
            <CardContent sx={cardContentStyle}>
              <Typography gutterBottom fontSize="20px" fontWeight={700}>
                {title}
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {description}
              </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }