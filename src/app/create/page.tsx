"use client";

import { api } from "~/trpc/react";
import { useForm } from "react-hook-form";
import OpenAI from "openai";
import { useState } from "react";

const CreatePage = () => {
  const [choices, setChoices] = useState<string[]>([]);

  const create = api.post.create.useMutation({
    onError: (err) => {
      console.error(err);
    },
  });

  const { register, handleSubmit, reset } = useForm();

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  async function handlePrompt(value: string) {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a creative writer. When given a brief explanation of an idea, you should provide two possible next steps for the story to continue in. These next steps should be short and simple. Please put each next step on a new line. The format should be: <next step 1>\n<next step 2>",
        },
        { role: "user", content: value },
      ],
      model: "gpt-3.5-turbo",
    });

    const response = completion.choices[0]?.message.content;

    response?.split("\n").forEach((message) => {
      setChoices((choices) => [...choices, message]);
    });
  }

  return (
    <div className="flex grow justify-center bg-neutral-950 p-8">
      <div className="flex h-full w-5/6 flex-col place-items-center justify-between gap-2">
        <h1 className="text-nowrap bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-2xl font-bold text-transparent">
          What are you brainstorming?
        </h1>
        <div className="flex h-full w-full divide-x divide-amber-400 rounded border border-amber-400 bg-neutral-900">
          {choices.map((choice, index) => (
            <p key={index} className="w-1/2 p-4 text-white">
              {choice}
            </p>
          ))}
        </div>
        {choices.length < 2 ? (
          <form
            onSubmit={handleSubmit((values) => {
              create.mutate({
                name: values.name,
                description: values.description,
                published: values.published,
              });
              reset();
              handlePrompt(values.name);
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
