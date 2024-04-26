import { FC, useState } from "react";

export const CreateToDoHalfModal: FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  return (
    <div className="absolute bttom-0 left-0 w-full h-5/6 bg-white p-4 rounded-t-2xl flex flex-col items-center justify-start">
      <div className="">
        <h1>Create new ToDo List</h1>
      </div>
      <form>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">Create</button>
        </div>
      </form>
    </div>
  );
};
