# page-constructor

Making a react component that builds tables with the option of edit and insert dialogs.
Fully dynamic. Add in some options if you want.

This will populate a complete table with valid json data:
```ts
<PageConstructor data={data} />
```

`PageConstructor` has optional props:
```<PageConstructor data={data} editable labelOverride={["Foo", "Bar"]} onEdit={() => smth} onInsert={() => smth} />```
