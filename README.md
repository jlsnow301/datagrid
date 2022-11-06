# table constructor

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
  onSave={onSave}
  onDelete={onDelete}
  options={options}
/>
```

### Options
Creating an options object allows you to hide certain elements, make them optional, or create drop down selectors. 
Useful if you're building with data you don't want to directly mutate, or take unused values elsewhere.
