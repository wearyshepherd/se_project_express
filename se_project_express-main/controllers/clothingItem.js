const { BAD_REQUEST, FORBIDDEN, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");
const ClothingItem = require('../models/clothingItem');

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user && req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        res.status(BAD_REQUEST).send({ message: "Validation error" });
      } else {
        res.status(SERVER_ERROR).send({ message: "Error from createItem" });
      }
    });
};


const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(() => res.status(SERVER_ERROR).send({ message: "Error from getItems" }));
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  const userId = req.user && req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((clothingItem) => {
      if (clothingItem.owner.toString() !== userId) {
        return res.status(FORBIDDEN).send({ message: "You do not have permission to delete this item" });
      }

      return ClothingItem.findByIdAndDelete(itemId)
      .then(() => res.status(200).send({ message: "Item successfully deleted" }))
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({ message: "Item not found" });
      } else if (e.name === "CastError") {
        res.status(BAD_REQUEST).send({ message: "Invalid ID format" });
      } else {
        res.status(SERVER_ERROR).send({ message: "Error from deleteItem" });
      }
    });
};


const likeItem = (req, res) => {
  const {_id: userId} = req.user || {};
  const {itemId} = req.params;

  ClothingItem.findByIdAndUpdate(itemId, {$addToSet: {likes: userId}}, {new:true})
  .orFail()
  .then((item) => res.status(200).send({data:item}))
  .catch((e) => {
    if (e.name === "DocumentNotFoundError") {
      res.status(NOT_FOUND).send({message: "Item not found"})
    } else if (e.name === "CastError") {
        res.status(BAD_REQUEST).send({message: "Invalid ID format"})
    } else {
      res.status(SERVER_ERROR).send({message: "Error from likeItem"})
    }
});
};

const unlikeItem = (req, res) => {
  const {_id: userId} = req.user || {};
  const {itemId} = req.params;

  ClothingItem.findByIdAndUpdate(itemId, {$pull: {likes: userId}}, {new: true})
  .orFail()
  .then((item) => res.status(200).send({data: item}))
  .catch((e) => {
    if (e.name === "DocumentNotFoundError") {
      res.status(NOT_FOUND).send({message: "Item not found"})
    } else if (e.name === "CastError") {
      res.status(BAD_REQUEST).send({message: "Invalid ID format"})
    } else {
      res.status(SERVER_ERROR).send({message: "Error from unlikeItem"})
    }
});
}


module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
}
