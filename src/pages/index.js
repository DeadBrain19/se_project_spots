import "./index.css";
import logo from "../images/Logo.svg";
import avatar from "../images/avatar.jpg";
import editProfile from "../images/Edit-Profile.svg";
import plusSign from "../images/Plus-sign.svg";
import { enableValidation, validationConfig } from "../scripts/validation";
import Api from "../utils/Api";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "c56e30dc-2883-4270-a59e-b2f7bae969c6",
    "Content-Type": "application/json",
  },
});

// Destructure the second item in the callback of the .then()
api.getAppInfo().then(([cards]) => {
  cards.forEach((cardData) => {
    const cardElement = getCardElement(cardData);
    cardListEl.append(cardElement);
  });

  //Handle the user's information
  //set src of image
  // set text content of both elements
});
//profile elements
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileSaveBtn = editProfileModal.querySelector(".modal__submit-btn");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostSubmitBtn = newPostModal.querySelector(".modal__submit-btn");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostForm = newPostModal.querySelector(".modal__form");
const newPostUrl = newPostForm.querySelector("#card-image-input");
const newPostCaption = newPostForm.querySelector("#card-caption-input");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const cardListEl = document.querySelector(".cards__list");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", escClose);
  setTimeout(() => {
    document.addEventListener("click", clickClose);
  }, 0);
}

function escClose(event) {
  const openedModal = document.querySelectorAll(".modal_is-opened");
  if (event.key === "Escape") {
    for (let i = 0; i < openedModal.length; ++i) {
      closeModal(openedModal[i]);
    }
  }
}

function clickClose(event) {
  const openedModal = document.querySelectorAll(".modal_is-opened");
  for (let i = 0; i < openedModal.length; ++i) {
    if (event.target === openedModal[i]) {
      closeModal(openedModal[i]);
    }
  }
}

function closeModal(modal) {
  document.removeEventListener("click", clickClose);
  document.removeEventListener("keydown", escClose);
  modal.classList.remove("modal_is-opened");
}

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    validationConfig
  );
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

previewModalCloseBtn.addEventListener("click", function () {
  closeModal(previewModal);
});

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-btn");
  const deleteButton = cardElement.querySelector(".card__delete-btn");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  likeButton.addEventListener("click", function () {
    likeButton.classList.toggle("card__like-btn_is-active");
  });

  deleteButton.addEventListener("click", function () {
    deleteButton.parentNode.remove();
  });

  cardImage.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });
  return cardElement;
}

function handleEditProfileSubmit(evt) {
  // TODO use data argument instead of the input values
  evt.preventDefault();
  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = editProfileNameInput.value;
      profileDescriptionEl.textContent = editProfileDescriptionInput.value;
      disableButton(editProfileSaveBtn, validationConfig);
      closeModal(editProfileModal);
    })
    .catch(console.error);
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleNewPostSubmit(evt) {
  evt.preventDefault();

  const inputValues = getCardElement({
    name: newPostCaption.value,
    link: newPostUrl.value,
  });

  const cardElement = inputValues;
  cardListEl.prepend(cardElement);
  disableButton(newPostSubmitBtn, validationConfig);
  closeModal(newPostModal);
  newPostForm.reset();
}

newPostForm.addEventListener("submit", handleNewPostSubmit);

enableValidation(validationConfig);
