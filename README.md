# table constructor

Making a react component that builds tables with the option of edit and insert dialogs.
Fully dynamic. Add in some options if you want. 

This will populate a complete table with valid json data:
```TSX
<PageConstructor data={data} />
```

Where table constructor really shines is in creating complete forms with type validation based on the initial data[0] object. I'm still working on it a bit, but soon this should infer what types are expected in a form without having to manually create anything. As of yet, it will customize the form based on the data[0]'s type, creating text and number fields, checkboxes, and selections (req: "selections" in options).


`PageConstructor` has optional props:
```TSX
<PageConstructor 
  data={data} 
  editable
  onSave={onSave}
  onDelete={onDelete}
  options={options}
  templates={templates}
/>
```

### Options
Creating an options object allows you to hide certain elements, make them optional, or create drop down selectors. 
Useful if you're building with data you don't want to directly mutate, or take unused values elsewhere.

### Templates
An array of objects similar of the same type as data. Like favorites, if any item is in this list, they can use it as a template to pre-populate the form with the provided data.
