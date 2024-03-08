"use client";

import { api } from "~/trpc/react";
import { useForm } from "react-hook-form";

const CreatePage = () => {
  const create = api.post.create.useMutation({
    onError: (err) => {
      console.error(err);
    },
  });

  const { register, handleSubmit, reset } = useForm();

  return (
    <div className="flex grow justify-center bg-neutral-950 p-8">
      <form
        onSubmit={handleSubmit((values) => {
          create.mutate({
            name: values.name,
            description: values.description,
            published: values.published,
          });
          reset();
        })}
      >
        <div className="flex flex-col gap-4">
          <input
            type="text"
            {...register("name")}
            placeholder="name"
            className="input"
            required
          />
          <input
            type="text"
            {...register("description")}
            placeholder="description"
            className="input"
          />
          <input type="checkbox" {...register("published")} className="input" />
          <button type="submit" className="btn btn-primary">
            {create.isLoading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePage;
