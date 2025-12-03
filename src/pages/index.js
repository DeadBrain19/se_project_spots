import "./index.css";

import {
  enableValidation,
  resetValidation,
  disableButton,
  validationConfig,
} from "../scripts/validation.js";

import Api from "../utils/Api.js";

import logo from "../images/logo.svg";
const logoImg = document.querySelector(".header__logo");
logoImg.src = logo;

//Profile variables
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileBtn = document.querySelector(".profile__edit-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const nameInput = editProfileModal.querySelector("#full-name");
const descriptionInput = editProfileModal.querySelector(
  "#personal-description"
);
const profileForm = document.forms["profile-form"];
const profileEditSaveBtn = document.querySelector(
  "#edit-profile-modal .form__button"
);

//Profile picture variables
const profilePicModal = document.querySelector("#edit-profile-picture");
const editProfilePicBtn = document.querySelector(".profile__image_edit-button");
const profilePicInput = document.querySelector("#profile-picture");
const profilePicForm = document.forms["profile-picture-form"];
const profileImage = document.getElementById("image-profile");
const profilePicSaveBtn = document.querySelector(
  "#edit-profile-picture .form__button"
);

//Post variables
const newPostModal = document.querySelector("#new-post-modal");
const newPostBtn = document.querySelector(".profile__post-button");
const cardForm = document.forms["new-post-form"];
const cardFormElements = cardForm.elements;
const imageLink = cardFormElements["image-link"];
const imageCaption = cardFormElements["image-caption"];
const newPostSaveBtn = document.querySelector("#new-post-modal .form__button");

//Card modal variables
const cardModal = document.querySelector("#card-modal");
const modalCardImage = cardModal.querySelector(".modal__card-image");
const modalCardText = cardModal.querySelector(".modal__card-text");

//Delete modal variables
const deleteModal = document.querySelector("#delete-modal");
const modalDeleteBtn = deleteModal.querySelector(".modal__delete-btn");
const modalCancelBtn = deleteModal.querySelector(".modal__cancel-btn");
let selectedCard;
let selectedCardId;

//Card template variables
const cardTemplate = document.querySelector("#card-template");
const cardContainer = document.querySelector(".cards__list");

//instantiate API and load cards
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "22fdb226-7a01-4811-8d5b-a97d4e91bdb8",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([initialCards, getUserInfo]) => {
    initialCards.forEach((cardElementData) => {
      const cardDetails = getCardElement(cardElementData);
      cardContainer.append(cardDetails);
    });
    profileName.textContent = getUserInfo.name;
    profileDescription.textContent = getUserInfo.about;
    document.querySelector(".profile__image").src = getUserInfo.avatar;
  })
  .catch((err) => {
    console.error(err);
  });

//Modal open/close functions
function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", closeModalEscapeKey);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", closeModalEscapeKey);
}

const modals = document.querySelectorAll(".modal");

modals.forEach((modal) => {
  modal.addEventListener("click", function (evt) {
    if (
      evt.target.classList.contains("modal__close-button") ||
      evt.target.classList.contains("modal")
    ) {
      closeModal(modal);
    }
  });
});

function closeModalEscapeKey(evt) {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal_is-opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
}

//Profile functions
editProfileBtn.addEventListener("click", openEditProfileModal);

function openEditProfileModal(evt) {
  evt.preventDefault();
  nameInput.value = profileName.textContent;
  descriptionInput.value = profileDescription.textContent;
  const inputList = Array.from(
    profileForm.querySelectorAll(validationConfig.formInput)
  );
  resetValidation(profileForm, inputList, validationConfig);
  openModal(editProfileModal);
}

function submitProfileForm(evt) {
  evt.preventDefault();
  profileEditSaveBtn.textContent = "Saving...";
  api
    .editUserInfo({ name: nameInput.value, about: descriptionInput.value })
    .then((updatedUserInfo) => {
      profileName.textContent = updatedUserInfo.name;
      profileDescription.textContent = updatedUserInfo.about;
      closeModal(editProfileModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      profileEditSaveBtn.textContent = "Save";
    });
}

profileForm.addEventListener("submit", submitProfileForm);

//Profile Pic functions
editProfilePicBtn.addEventListener("click", openProfilePicModal);

function openProfilePicModal(evt) {
  evt.preventDefault();
  const inputList = Array.from(
    profilePicForm.querySelectorAll(validationConfig.formInput)
  );
  resetValidation(profilePicForm, inputList, validationConfig);
  openModal(profilePicModal);
}

function submitProfilePicForm(evt) {
  evt.preventDefault();
  profilePicSaveBtn.textContent = "Saving...";
  api
    .updateProfilePicture({ avatar: profilePicInput.value })
    .then((updatedProfilePic) => {
      profileImage.src = updatedProfilePic.avatar;
      profilePicForm.reset();
      closeModal(profilePicModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      profilePicSaveBtn.textContent = "Save";
    });
}

profilePicForm.addEventListener("submit", submitProfilePicForm);

//Post form functions
newPostBtn.addEventListener("click", () => {
  openModal(newPostModal);
});

function submitPostForm(evt) {
  evt.preventDefault();
  newPostSaveBtn.textContent = "Saving...";
  api
    .addNewCard({ name: imageCaption.value, link: imageLink.value })
    .then((newPostValues) => {
      modalCardText.textContent = newPostValues.name;
      modalCardImage.src = newPostValues.link;
      const newCardElement = getCardElement(newPostValues);

      cardContainer.prepend(newCardElement);

      evt.target.reset();

      const buttonElement = cardForm.querySelector(
        validationConfig.submitButton
      );
      disableButton(buttonElement, validationConfig.submitButtonInactive);

      closeModal(newPostModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      newPostSaveBtn.textContent = "Save";
    });
}

cardForm.addEventListener("submit", submitPostForm);

//Post data/template functions and initial card functions
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardText = cardElement.querySelector(".card__text");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardText.textContent = data.name;

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-button_active");
  }

  cardLikeBtn.addEventListener("click", (evt) => {
    handleCardLikes(evt, data._id, cardElement);
  });

  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");

  cardDeleteBtn.addEventListener("click", () =>
    handleDeleteCard(cardElement, data)
  );

  cardImage.addEventListener("click", () => {
    modalCardImage.src = data.link;
    modalCardImage.alt = data.name;
    modalCardText.textContent = data.name;
    openModal(cardModal);
  });

  return cardElement;
}

//like functions
function handleCardLikes(evt, cardId) {
  const isLiked = evt.target.classList.contains("card__like-button_active");
  api
    .updateLikeStatus(cardId, !isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-button_active");
    })
    .catch(console.error);
}

//deleted card modal function
function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteModal);
}

//delete card submit function
function handleDeleteSubmit() {
  modalDeleteBtn.textContent = "Deleting...";
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      modalDeleteBtn.textContent = "Delete";
    });
}

modalDeleteBtn.addEventListener("click", handleDeleteSubmit);

modalCancelBtn.addEventListener("click", function () {
  closeModal(deleteModal);
});

enableValidation(validationConfig);
