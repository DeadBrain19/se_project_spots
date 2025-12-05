const validationConfig = {
  formSelector: ".form",
  submitButton: ".form__button",
  formInput: ".form__input",
  submitButtonInactive: "form__button_inactive",
  errorActive: "form__input-error_active",
  inputErrorType: "form__input_type_error",
};

const showInputError = (formElement, inputElement, errorMessage, config) => {
  const errorElement = formElement.querySelector(
    `.input-error-${inputElement.id}`
  );
  inputElement.classList.add(config.inputErrorType);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorActive);
};

const hideInputError = (formElement, inputElement, config) => {
  const errorElement = formElement.querySelector(
    `.input-error-${inputElement.id}`
  );
  inputElement.classList.remove(config.inputErrorType);
  errorElement.classList.remove(config.errorActive);
  errorElement.textContent = "";
};

const checkInputValidity = (formElement, inputElement, config) => {
  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      config
    );
  } else {
    hideInputError(formElement, inputElement, config);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

const disableButton = (buttonElement, inactiveButtonClass) => {
  buttonElement.classList.add(inactiveButtonClass);
  buttonElement.disabled = true;
};

const enableButton = (buttonElement, inactiveButtonClass) => {
  buttonElement.classList.remove(inactiveButtonClass);
  buttonElement.disabled = false;
};

const toggleButtonState = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement, config.submitButtonInactive);
  } else {
    enableButton(buttonElement, config.submitButtonInactive);
  }
};

const setEventListeners = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.formInput));
  const buttonElement = formElement.querySelector(config.submitButton);
  toggleButtonState(inputList, buttonElement, config);
  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

const enableValidation = (config) => {
  const formList = document.querySelectorAll(config.formSelector);
  formList.forEach((formElement) => {
    formElement.addEventListener("submit", function (evt) {
      evt.preventDefault();
    });
    setEventListeners(formElement, config);
  });
};

const resetValidation = (formElement, inputList, config) => {
  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, config);
  });
};

export { enableValidation, resetValidation, disableButton, validationConfig };
