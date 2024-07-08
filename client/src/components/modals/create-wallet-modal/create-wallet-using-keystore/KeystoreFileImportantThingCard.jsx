import { Card, CardContent, CardMedia, Typography } from "@mui/material";

const cardStyle = {
  width: "170px",
  height: "282px",
  padding: "24px",
  border: "1px solid #05c0a5",
  borderRadius: "7px",
  boxShadow: "0 8px 15px #f2f3f6",
};

const cardMediaStyle = {
  margin: "12px auto",
  width: "70px",
  height: "70px",
};

const cardContentStyle = {
  padding: 0,
  textAlign: "start",
};

const titleStyle = {
  fontSize: "14px",
  fontWeight: 700,
  margin: "4px 0 8px",
};

const descriptionStyle = {
  fontSize: "14px",
};

export default function KeystoreFileImportantThingCard({
  imagePath,
  imageAlt,
  title,
  description,
}) {
  return (
    <Card sx={cardStyle}>
      <CardMedia
        sx={cardMediaStyle}
        component="img"
        image={imagePath}
        alt={imageAlt}
      />
      <CardContent sx={cardContentStyle}>
        <Typography sx={titleStyle}>{title}</Typography>
        <Typography sx={descriptionStyle}>{description}</Typography>
      </CardContent>
    </Card>
  );
}