const { BadRequestError } = require("../utils/errors/BadRequestError");
const { ServerError } = require("../utils/errors/ServerError");
const { ForbiddenError } = require("../utils/errors/ForbiddenError");
const { NotFoundError } = require("../utils/errors/NotFoundError");

const ClothingItem = require("../models/clothingItem");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user && req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        next(new BadRequestError("Validation error"));
      } else {
        next(new ServerError("Error from createItem"));
      }
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(() => next(new ServerError("Error from getItems")));
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user && req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((clothingItem) => {
      if (clothingItem.owner.toString() !== userId) {
        return next(
          new ForbiddenError("You do not have permission to delete this item"),
        );
      }

      return ClothingItem.findByIdAndDelete(itemId).then(() =>
        res.status(200).send({ message: "Item successfully deleted" }),
      );
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("Invalid ID format"));
      } else {
        next(new ServerError("Error from deleteItem"));
      }
    });
};

const likeItem = (req, res, next) => {
  const { _id: userId } = req.user || {};
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("Invalid ID format"));
      } else {
        next(new ServerError("Error from likeItem"));
      }
    });
};

const unlikeItem = (req, res, next) => {
  const { _id: userId } = req.user || {};
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("Invalid ID format"));
      } else {
        next(new ServerError("Error from unlikeItem"));
      }
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
