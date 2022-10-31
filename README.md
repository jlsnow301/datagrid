# page constructor

Making a react component that builds tables with the option of edit and insert dialogs.
Fully dynamic. Add in some options if you want.

This will populate a complete table with valid json data:
```TSX
<PageConstructor data={data} />
```

`PageConstructor` has optional props:
```TSX
<PageConstructor 
  data={data} 
  editable 
  labelOverride={["Foo", "Bar"]} 
  onEdit={() => smth} 
  onInsert={() => smth} 
/>
```
