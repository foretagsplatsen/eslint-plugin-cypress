## Do not use `it.only` command

It is common to use the `it.only` pattern while writing tests to save time by not running other tests not being edited.
This flag is usually not wanted in committed files though, as it can lead to other tests not being run when they're expected to.

Invalid:

```js
it.only("tests only this", () => {});
```

Valid:

```js
it("tests stuff", () => {});
it.skip("doesn't test this", () => {});
```