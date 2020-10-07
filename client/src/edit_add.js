import React, { useState } from "react";

const ItemForm = ({ initialName, initialGenre, disabled, onSubmit }) => {
  const [name, setName] = useState(initialName || "");
  const [genre, setGenre] = useState(initialGenre || "");

  return (
    <div>
      <b>{initialName ? "Edit Item" : "Add Item"}</b>
      <div>
        <div>
          <span>Name</span>
          <input
            disabled={disabled}
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div>
          <span>Genre</span>
          <input
            disabled={disabled}
            value={genre}
            onChange={e => setGenre(e.target.value)}
          />
        </div>
        <div>
          <button
            disabled={disabled}
            className="dim pointer"
            onClick={() => {
              onSubmit({ name, genre });
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemForm;
