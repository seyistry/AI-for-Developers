"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PollOption = {
  id: string;
  text: string;
};

function usePollOptions(initialCount = 2) {
  const [options, setOptions] = useState<PollOption[]>(
    Array.from({ length: initialCount }, (_, i) => ({
      id: `${i + 1}`,
      text: "",
    }))
  );

  const addOption = useCallback(() => {
    setOptions((opts) => [...opts, { id: `${opts.length + 1}`, text: "" }]);
  }, []);

  const removeOption = useCallback((id: string) => {
    setOptions((opts) =>
      opts.length <= 2 ? opts : opts.filter((option) => option.id !== id)
    );
  }, []);

  const changeOption = useCallback((id: string, text: string) => {
    setOptions((opts) =>
      opts.map((option) => (option.id === id ? { ...option, text } : option))
    );
  }, []);

  return { options, addOption, removeOption, changeOption };
}

function validatePoll(
  title: string,
  description: string,
  options: PollOption[]
) {
  if (!title.trim()) return "Please enter a poll title";
  if (!description.trim()) return "Please enter a poll description";
  if (options.filter((option) => option.text.trim() !== "").length < 2)
    return "Please enter at least 2 options";
  return null;
}

export default function CreatePollPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { options, addOption, removeOption, changeOption } = usePollOptions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorMsg = validatePoll(title, description, options);
    if (errorMsg) {
      alert(errorMsg);
      return;
    }
    setIsSubmitting(true);
    try {
      const validOptions = options.filter(
        (option) => option.text.trim() !== ""
      );
      const response = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          options: validOptions.map((o) => ({ text: o.text })),
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create poll");
      }
      alert("Poll created successfully!");
      router.push("/polls");
    } catch (error) {
      console.error("Failed to create poll:", error);
      alert(
        `Failed to create poll: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => router.push("/polls")}
      >
        Back to Polls
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Poll</CardTitle>
          <CardDescription>
            Fill out the form below to create a new poll
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Poll Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter poll title"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter poll description"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Poll Options</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                >
                  Add Option
                </Button>
              </div>

              {options.map((option, index) => (
                <div key={option.id} className="flex items-center gap-2">
                  <Input
                    value={option.text}
                    onChange={(e) => changeOption(option.id, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeOption(option.id)}
                    disabled={options.length <= 2}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Poll..." : "Create Poll"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
