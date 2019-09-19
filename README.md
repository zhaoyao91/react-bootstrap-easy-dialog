# React Bootstrap Easy Dialog

React Bootstrap Dialog made easy!

## Introduction

Based on [react-bootstrap modal](https://react-bootstrap.github.io/components/modal/), this package created a set of apis,
which are similar to the standard `window.alert`, `window.confirm` and `window.prompt`, which cover 80% of dialog usage.

## Demo and Usage

[Demo and usage.](https://codesandbox.io/s/react-boostrap-easy-dialog-4zkcv)

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

### Context Style

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

## Options

The following options can be passed into `Dialog`, `DialogProvider` as the props, or `dialog.alert`, `dialog.confirm`,
`dialog.prompt` as the second arguments.

- `title`? : string
- `inputProps`? : object // options passed into the underlining [Form.Control](https://react-bootstrap.github.io/components/forms/#form-control-props)
- `cancelButtonProps`? : object // options passed into the underlining [Button](https://react-bootstrap.github.io/components/buttons/#button-props)
- `confirmButtonProps`? : object // options passed into the underlining [Button](https://react-bootstrap.github.io/components/buttons/#button-props)
- `autoFocus` = 'select' : boolean | 'select'
- `stubborn` = true : boolean // if true, clicking the background would not trigger canceling
- `centered` = true : boolean // see [Modal](https://react-bootstrap.github.io/components/modal/#modal-props)
- `animation` = true : boolean // see [Modal](https://react-bootstrap.github.io/components/modal/#modal-props)
- `scrollable`? : boolean // see [Modal](https://react-bootstrap.github.io/components/modal/#modal-props)
- `size`? : string // see [Modal](https://react-bootstrap.github.io/components/modal/#modal-props)

## Advanced Usage

see [demo and usage.](#demo-and-usage)

### License

MIT
