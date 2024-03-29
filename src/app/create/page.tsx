"use client";

import { api } from "~/trpc/react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "~/server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;
type Post = RouterOutput["post"]["getById"];

const CreatePage = () => {
  const [choices, setChoices] = useState<string[]>([]);
  const [post, setPost] = useState<Post>(null);
  const [pageCount, setPageCount] = useState(0);

  const create = api.post.create.useMutation({
    onSuccess: async (data) => {
      setChoices(data.choices || []);
      setPost(data.post);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const addPage = api.post.addPage.useMutation({
    onSuccess: async (data) => {
      setChoices(data.choices || []);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const { register, handleSubmit, reset } = useForm();

  return (
    <div className="flex grow justify-center bg-neutral-950 p-8">
      <div className="flex h-full w-5/6 flex-col place-items-center justify-between gap-2">
        <h1 className="text-nowrap bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-2xl font-bold text-transparent">
          What are you brainstorming?
        </h1>
        <div className="flex h-full w-full divide-x divide-amber-400 rounded border border-amber-400 bg-neutral-900">
          {choices
            .filter((choice) => choice != "")
            .map((choice, index) => (
              <div className="w-1/2" key={choice + index}>
                <button
                  key={index}
                  className="appear h-full w-full p-4 text-white transition-all hover:bg-white/5"
                  onClick={() => {
                    addPage.mutate({
                      postId: post!.id,
                      content: choice,
                      number: pageCount + 1,
                    });
                    setPageCount(pageCount + 1);
                  }}
                >
                  {choice}
                </button>
              </div>
            ))}
        </div>
        {choices.length < 2 ? (
          <form
            onSubmit={handleSubmit((values) => {
              create.mutate({
                prompt: values.name,
              });
              setPageCount(pageCount + 1);
              reset();
            })}
            className="w-full rounded border border-amber-400 bg-neutral-900"
          >
            <div className="flex h-full">
              <textarea
                {...register("name")}
                placeholder="What are you thinking..."
                className="max-h-[10em] min-h-full grow overflow-y-auto bg-transparent p-4 text-white outline-none"
                required
                rows={1}
              />
              <button
                type="submit"
                className="right-0 m-2 place-self-end rounded bg-neutral-800 p-2 text-neutral-500"
              >
                {create.isLoading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
};

export default CreatePage;
