"use client";


import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

interface DiscordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: DiscordSchemaType) => void;
  defaultValues?: Partial<DiscordSchemaType>;
}

export const DiscordDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: DiscordDialogProps) => {
  const form = useForm<DiscordSchemaType>({
    resolver: zodResolver(DiscordSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "",
      username: defaultValues.username || "",
      content: defaultValues.content || "",
      webhookUrl: defaultValues.webhookUrl || "",
    },
  });

  // Reset from values when dialog opens with new defaults
  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "",
        username: defaultValues.username || "",
        content: defaultValues.content || "",
        webhookUrl: defaultValues.webhookUrl || "",
      });
    }
  }, [defaultValues, form, open]);

  const watchVariableName =
    useWatch({
      control: form.control,
      name: "variableName",
    }) || "myDiscord";

  const handleSubmit = (values: DiscordSchemaType) => {
    onSubmit(values);
    onOpenChange(false);
  };

  const fields: FormFieldValues[] = [
    {
      type: "input",
      name: "variableName",
      placeholder: "myDiscord",
      label: "Variable Name",
      description: (
        <>
          Use this name to reference the result in other nodes:{" "}
          <code
            className={codeStyle()}
          >{`{{${watchVariableName}.aiResponse}}`}</code>
        </>
      ),
    },
    {
      type: "input",
      name: "webhookUrl",
      placeholder: "https://discord.com/api/webhooks/...",
      label: "Webhook URL",
      description: (
        <>
          Get this from Discord:{" "}
          <span className="font-medium">Channel Settings</span> →{" "}
          <span className="font-medium">Integrations</span> →{" "}
          <span className="font-medium">Webhooks</span>
        </>
      ),
    },
    {
      type: "textarea",
      name: "content",
      label: "Message Content",
      className: "font-mono text-xs min-h-[80px]",
      placeholder: "Summary: {{myGemini.text}}",
      description: (
        <>
          The message to send. Use{" "}
          <code className={codeStyle()}>{"{{variables}}"}</code> or{" "}
          <code className={codeStyle()}>{"{{json variable}}"}</code> to
          stringify objects.
        </>
      ),
    },
    {
      type: "input",
      name: "username",
      label: "Bot Username (Optional)",
      placeholder: "Workflow Bot",
      description: <>Override the webhook&apos;s default username.</>,
    },
  ];

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Discord"
      description="Configure Discord webhook settings for this node."
      hasCloseButton={false}
      icon="/discord.svg"
    >
      <FormGenerator
        form={form}
        onSubmit={handleSubmit}
        className={formStyle()}
        fields={fields}
        btnContext={{ label: "Save" }}
      />
    </AppDialog>
  );
};