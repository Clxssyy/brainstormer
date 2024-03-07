"use client";

import { api } from "~/trpc/react";

const CreatePage = () => {
  const create = api.post.create.useMutation({
    onError: (err) => {
      console.error(err);
    },
  });

  return (
    <div className="flex grow justify-center bg-neutral-950 p-8">
      <div>
        <input type="text" id="name" className="p-4" />
        <button
          className="bg-amber-400 p-4"
          onClick={() => {
            create.mutate({
              name: (document.getElementById("name") as HTMLInputElement).value,
            });
          }}
        >
          {create.isLoading ? "Creating..." : "Create"}
        </button>
      </div>
    </div>
  );
};

export default CreatePage;
