import React, { useEffect, useState } from "react";
import CardComponent from "../components/cardcomponent";
import { Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";

const Home = () => {
  const [cardsArr, setCardArr] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("/cards/cards")
      .then(({ data }) => {
        setCardArr(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDeleteFromInitialCardsArr = async (id) => {
    try {
      setCardArr((newCardsArr) =>
        newCardsArr.filter((item) => item._id !== id)
      );
      await axios.delete("/cards/" + id);
    } catch (err) {
      console.log("error delate", err.response.data);
    }
  };

  const handleEditFromInitialCardsArr = (id) => {
    navigate(`edit/${id}`);
  };
  if (!cardsArr) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Grid container spacing={2}>
        {cardsArr.map((item) => (
          <Grid item xs={4} key={item._id + Date.now()}>
            <CardComponent
              id={item._id}
              title={item.title}
              subTitle={item.subTitle}
              phone={item.phone}
              address={
                item.country +
                ", " +
                item.city +
                ", " +
                item.street +
                " " +
                item.houseNumber
              }
              img={item.image ? item.image.url : ""}
              description={item.description}
              onDelete={handleDeleteFromInitialCardsArr}
              onEdit={handleEditFromInitialCardsArr}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;
