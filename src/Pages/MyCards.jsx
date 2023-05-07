import React, { useEffect, useState } from "react";
import CardComponent from "../components/cardcomponent";
import { Box, Grid, IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import ROUTES from "../routes/ROUTES";
import jwt_decode from "jwt-decode";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
const MyCards = () => {
  const [cardsArr, setCardArr] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [cardToDelete, setCardToDelete] = useState(null);

  const navigate = useNavigate();
  const payload = useSelector((bigPie) => bigPie.authSlice.payload);


  useEffect(() => {
    axios
      .get("/cards/my-cards")
      .then(({ data }) => {
        setCardArr(data);
      })
      .catch((err) => console.log(err));
  }, []);




  const handleDeleteFromInitialCardsArr = async (id) => {
    setCardToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCard = async () => {
    try {
      setCardArr((newCardsArr) =>
        newCardsArr.filter((item) => item._id !== cardToDelete)
      );
      setIsDeleteDialogOpen(false);
      toast.success("Deletion was successful");
      await axios.delete("/cards/" + cardToDelete);
    } catch (err) {
      console.log("error delate", err.response.data);
    }
  };

  const delete1 = (id) => {
    setCardArr(cardsArr.filter((card) => card[1]._id !== id));
  };

  const handleEditFromInitialCardsArr = (id) => {
    navigate(`/edit/${id}`);
  };
  const handleBtnCliclToCreate = () =>{
navigate("/create")
  }
  if (!cardsArr) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Box textAlign="center" mt={4}>
        <Typography variant="h3" gutterBottom>
          my cards
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Find Your Perfect Nest on Our Home Page
        </Typography>
      </Box>
      <IconButton
        onClick={handleBtnCliclToCreate}
        size="large"
        color="secondary"
      >
        <AddCircleIcon fontSize="inherit" />
      </IconButton>

      <Grid container spacing={2}>
        {cardsArr.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={item._id + Date.now()}>
            <Typography
              sx={{
                backgroundColor: "green",
                color: "white",
                padding: "2px 6px",
                borderRadius: "5px",
                marginTop: "5px",
                width: "max-content",
                marginX: "auto",
              }}
            >
              Your card!
            </Typography>
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
              email={item.email}
              createdAt={item.createdAt}
              likes={item.likes}
              bizNumber={item.bizNumber}
              onDelete={handleDeleteFromInitialCardsArr}
              onEdit={handleEditFromInitialCardsArr}
              onDeletefav={delete1}
              notConnected={!payload}
              canDelete={
                (payload && payload.isAdmin) ||
                (payload && payload.biz && payload._id === item.user_id)
              }
              canEdit={payload && payload.biz && payload._id === item.user_id}
              isFav={
                localStorage.token &&
                item.likes.includes(jwt_decode(localStorage.token)._id)
              }
            />
          </Grid>
        ))}
        <Dialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
        >
          <DialogTitle>Are you sure you want to delete this card?</DialogTitle>
          <DialogContent>
            Deleting a card is permanent and cannot be undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteCard} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Box>
  );
};
export default MyCards;
