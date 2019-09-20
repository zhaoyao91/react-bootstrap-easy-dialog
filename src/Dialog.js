import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export const DialogContext = createContext(null);

export function DialogProvider({ children, ...options }) {
  const [showOptions, setShowOptions] = useState({});
  const [show, setShow] = useState(false);
  const exitedRef = useRef(true);
  const cancelRef = useRef();

  // when unmount, if some dialog is still open, trigger its canceling process
  useEffect(() => {
    return () => {
      cancelRef.current && cancelRef.current();
    };
  }, []);

  function handleExited() {
    setShowOptions({});
    exitedRef.current = true;
  }

  const dialog = useMemo(() => {
    function buildMethod(buildOptions, failValue) {
      return async (text, options) => {
        // if the previous dialog is not exited, fails
        if (exitedRef.current === false) return failValue;

        return new Promise(resolve => {
          setShow(true);
          exitedRef.current = false;

          function done(result) {
            setShow(false);
            cancelRef.current = null;
            resolve(result);
          }

          const finalOptions = buildOptions(done);

          cancelRef.current = finalOptions.onCancel;

          setShowOptions({
            text,
            ...options,
            ...finalOptions
          });
        });
      };
    }

    return {
      alert: buildMethod(
        done => ({
          input: false,
          cancelButton: false,
          confirmButton: true,
          onCancel: () => done(false),
          onConfirm: () => done(true)
        }),
        false
      ),

      confirm: buildMethod(
        done => ({
          input: false,
          cancelButton: true,
          confirmButton: true,
          onCancel: () => done(false),
          onConfirm: () => done(true)
        }),
        false
      ),

      prompt: buildMethod(
        done => ({
          input: true,
          cancelButton: true,
          confirmButton: true,
          onCancel: () => done(null),
          onConfirm: inputValue => done(inputValue)
        }),
        null
      )
    };
  }, []);

  const mergedOptions = {
    ...options,
    ...showOptions,
    show,
    onExited: handleExited
  };

  // if animation === false, the onExited will not get triggered
  // so, when show turned into false, it is considered as exited
  useEffect(() => {
    if (!show && mergedOptions.animation === false) {
      handleExited();
    }
  }, [show, mergedOptions.animation]);

  return (
    <DialogContext.Provider value={dialog}>
      {children}
      <DialogUI {...mergedOptions} />
    </DialogContext.Provider>
  );
}

export const DialogConsumer = DialogContext.Consumer;

export function useDialog() {
  return useContext(DialogContext);
}

export function Dialog({ children, ...options }) {
  return (
    <DialogProvider {...options}>
      <DialogConsumer>{children}</DialogConsumer>
    </DialogProvider>
  );
}

export function DialogUI({
  show, // boolean
  title, // string?
  text, // string?
  input, // boolean?
  inputProps, // object? such as {as, type, defaultValue, refKey, ...}
  cancelButton, // boolean?
  cancelButtonProps, // object?
  confirmButton, // boolean?
  confirmButtonProps, // object?
  onConfirm, // (inputValue) => void
  onCancel, // () => void
  onExited, // () => void
  autoFocus = "select", // boolean | 'select'
  stubborn = true, // boolean?
  centered = true, // boolean?
  animation = true,
  scrollable,
  size
}) {
  const { defaultValue = "", refKey = "ref", ...otherInputProps } =
  inputProps || {};

  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef();

  // only set input value to default value when it shows up
  useEffect(() => {
    if (show) {
      setInputValue(defaultValue);
    }
  }, [show, defaultValue]);

  // if it is closed without animation, clear the input directly
  useEffect(() => {
    if (!show && animation === false) {
      setInputValue("");
    }
  }, [show, animation]);

  // set autoFocus properly
  useEffect(() => {
    if (show && input && autoFocus) {
      inputRef.current.focus();
      if (autoFocus === "select") {
        setImmediate(() => {
          inputRef.current && inputRef.current.select();
        });
      }
    }
  }, [show, input, autoFocus]);

  const showHeader = !!title;
  const showBody = !!text || !!input;

  function handleSubmit(e) {
    e.preventDefault();
    onConfirm(inputValue);
  }

  function handleConfirm() {
    onConfirm(inputValue);
  }

  function handleHide() {
    if (!stubborn) {
      onCancel();
    }
  }

  function handleCancel() {
    onCancel();
  }

  function handleInputValueChange(e) {
    setInputValue(e.target.value);
  }

  function handleExited() {
    // clear the input value on finish of the animation
    setInputValue("");
    onExited();
  }

  return (
    <Modal
      show={show}
      onHide={handleHide}
      centered={centered}
      onExited={handleExited}
      animation={animation}
      scrollable={scrollable}
      size={size}
    >
      {showHeader && (
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}
      {showBody && (
        <Modal.Body>
          {!!text && (
            <p style={{ marginBottom: input ? undefined : 0 }}>{text}</p>
          )}
          {input && (
            <Form onSubmit={handleSubmit}>
              {input && (
                <Form.Control
                  {...otherInputProps}
                  value={inputValue}
                  onChange={handleInputValueChange}
                  {...{ [refKey]: inputRef }}
                />
              )}
            </Form>
          )}
        </Modal.Body>
      )}
      <Modal.Footer>
        {cancelButton && (
          <Button
            variant="secondary"
            children="Cancel"
            {...cancelButtonProps}
            onClick={handleCancel}
          />
        )}
        {confirmButton && (
          <Button
            variant="primary"
            children="Confirm"
            {...confirmButtonProps}
            onClick={handleConfirm}
          />
        )}
      </Modal.Footer>
    </Modal>
  );
}
