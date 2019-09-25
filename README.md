# React Bootstrap Easy Dialog

React Bootstrap Dialog made easy!

## Introduction

Based on [react-bootstrap modal](https://react-bootstrap.github.io/components/modal/), this package created a set of apis,
which are similar to the standard `window.alert`, `window.confirm` and `window.prompt`, which cover 80% of dialog usage.

## Demo

[Demo](https://codesandbox.io/s/react-boostrap-easy-dialog-4zkcv)

![demo](https://user-images.githubusercontent.com/3808838/65297097-4ffd7280-db99-11e9-9aaf-bc421c9ec361.gif)

## Installation

```bash
npm i react-bootstrap-easy-dialog
```

You also need the depended packages:

```bash
npm i react react-bootstrap
```

## Usage

### Use hook style

```js
import { DialogProvider, useDialog } from "react-bootstrap-easy-dialog";

function App() {
  return (
    <DialogProvider>
      <Page />
    </DialogProvider>
  );
}

function Page() {
  const dialog = useDialog();

  function handleClick() {
    dialog.alert("Awesome!");
  }

  return <button onClick={handleClick}>Alert</button>;
}
```

### Render prop style

```js
import { Dialog } from "react-bootstrap-easy-dialog";

function App() {
  return (
    <Dialog>
      {dialog => {
        async function handleClick() {
          const confirmed = await dialog.confirm("Buy a Huawei Mate 30 pro?");
          console.log(confirmed);
        }
        return <button onClick={handleClick}>Confirm</button>;
      }}
    </Dialog>
  );
}
```

### Context style

```js
import { DialogProvider, DialogConsumer } from "react-bootstrap-easy-dialog";

function App() {
  return (
    <DialogProvider>
      <DialogConsumer>
        {dialog => {
          async function handleClick() {
            const reason = await dialog.prompt("Why do you like it?", {
              title: "The Reason",
              defaultValue: "It has 5G."
            });
            console.log(reason);
          }
          return <button onClick={handleClick}>Prompt</button>;
        }}
      </DialogConsumer>
    </DialogProvider>
  );
}
```

## Advanced Usage

### Wait until hidden

Generally, dialog would return as soon as canceling or confirming gets triggered, by this time, the dialog is still in
the animation, so calling another dialog would fail directly.

However, you can explicitly wait until it gets hidden completely.

```js
const confirmed = await dialog.confirm('Delete your home?').hidden; // it would resolve after the dialog is completely hidden
const inputName = await dialog.prompt('Confirm the home name'); // or await dialog.prompt(...).done
```

## APIs

- `dialog.alert` : async (text, options?) => boolean
  > Generally it would returns `true`, but if `stubborn` is set to `false` and the dialog is closed by clicking the
  > background, it would return `false`
- `dialog.confirm` : async (text, options?) => boolean
- `dialog.prompt` : async (text, options?) => string | null
  > If the user **confirm** or **submit** the dialog, it returns a `string`, otherwise it returns `null`

## Options

The following options can be passed into `Dialog`, `DialogProvider` as the props, or `dialog.alert`, `dialog.confirm`,
`dialog.prompt` as the second argument.

- `title`? : string
- `inputProps`? : object // options passed into the underlining [Form.Control](https://react-bootstrap.github.io/components/forms/#form-control-props)
- `cancelButtonProps`? : object // options passed into the underlining [Button](https://react-bootstrap.github.io/components/buttons/#button-props)
- `confirmButtonProps`? : object // options passed into the underlining [Button](https://react-bootstrap.github.io/components/buttons/#button-props)
- `autoFocus` = 'select' : boolean | 'select'
- `stubborn` = false : boolean // if true, clicking the background would not trigger canceling

## Advanced Usage

See [Demo](#demo).

### License

MIT
