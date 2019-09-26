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

export function DialogProvider({ children, ...providerOptions }) {
  const [show, setShow] = useState(false);
  const [showOptions, setShowOptions] = useState({});
  const [hidden, setHidden] = useState(true);
  const hiddenRef = useRef(hidden);
  const previousHiddenRef = useRef(hidden);
  const resolveDoneRef = useRef(null);
  const resolveHiddenRef = useRef(null);
  const doneResultRef = useRef();

  const mergedOptions = {
    ...providerOptions,
    ...showOptions,
    show
  };

  function resolveDone(result) {
    if (resolveDoneRef.current) {
      resolveDoneRef.current(result);
      resolveDoneRef.current = null;
      doneResultRef.current = result;
    }
  }

  function resolveHidden() {
    if (resolveHiddenRef.current) {
      resolveHiddenRef.current(doneResultRef.current);
      resolveHiddenRef.current = null;
      doneResultRef.current = undefined;
    }
  }

  useEffect(() => {
    hiddenRef.current = hidden;
    const previousHidden = previousHiddenRef.current;
    previousHiddenRef.current = hidden;
    if (previousHidden === false && hidden === true) {
      resolveHidden();
    }
  }, [hidden]);

  const dialog = useMemo(() => {
    function buildMethod(methodOptions, failValue, okValue) {
      return function(text, userOptions) {
        if (!hiddenRef.current) return failValue;

        setShow(true);
        setHidden(false);

        setShowOptions({
          ...methodOptions,
          ...userOptions,
          text,
          onCancel() {
            setShow(false);
            resolveDone(failValue);
          },
          onConfirm(result) {
            setShow(false);
            resolveDone(okValue === undefined ? result : okValue);
          },
          onExited() {
            setShowOptions({});
            setHidden(true);
          }
        });

        const donePromise = new Promise(resolve => {
          resolveDoneRef.current = resolve;
        });
        donePromise.done = donePromise;
        donePromise.hidden = new Promise(resolve => {
          resolveHiddenRef.current = resolve;
        });

        return donePromise;
      };
    }

    return {
      alert: buildMethod(
        {
          input: false,
          cancelButton: false,
          confirmButton: true
        },
        false,
        true
      ),

      confirm: buildMethod(
        {
          input: false,
          cancelButton: true,
          confirmButton: true
        },
        false,
        true
      ),

      prompt: buildMethod(
        {
          input: true,
          cancelButton: true,
          confirmButton: true
        },
        null,
        undefined
      )
    };
  }, []);

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
  autoFocus = "select", // boolean | 'select' ?
  stubborn = false // boolean?
}) {
  const { defaultValue = "", refKey = "ref", ...otherInputProps } =
  inputProps || {};

  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef();
  const submitButtonRef = useRef();

  // only set input value to default value when it shows up
  useEffect(() => {
    if (show) {
      setInputValue(defaultValue);
    }
  }, [show, defaultValue]);

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
    if (submitButtonRef.current) {
      submitButtonRef.current.click();
    } else {
      onConfirm();
    }
  }

  function handleHide() {
    if (!stubborn) {
      handleCancel();
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
    <Modal show={show} onHide={handleHide} onExited={handleExited}>
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
              <Form.Control
                {...otherInputProps}
                value={inputValue}
                onChange={handleInputValueChange}
                {...{ [refKey]: inputRef }}
              />
              <Button type="submit" hidden ref={submitButtonRef}>
                Submit
              </Button>
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
