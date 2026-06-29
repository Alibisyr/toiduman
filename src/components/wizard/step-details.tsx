"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Plus, Trash2 } from "lucide-react";
import {
  wizardFormSchema,
  type WizardFormInput,
  type WizardFormValues,
} from "@/lib/wizard";
import { useDraft } from "@/lib/draft-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StepHeading } from "./step-heading";

export const DETAILS_FORM_ID = "wizard-details-form";

export function StepDetails() {
  const t = useTranslations("Wizard");
  const setForm = useDraft((s) => s.setForm);
  const next = useDraft((s) => s.next);
  // Snapshot the persisted draft once so typing doesn't re-init the form.
  const [defaults] = useState<WizardFormInput>(() => useDraft.getState().form);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<WizardFormInput, unknown, WizardFormValues>({
    resolver: zodResolver(wizardFormSchema),
    defaultValues: defaults,
    mode: "onTouched",
  });

  const hosts = useFieldArray({ control, name: "hostNames" });
  const program = useFieldArray({ control, name: "program" });
  const contacts = useFieldArray({ control, name: "contacts" });

  // Autosave: mirror form values into the draft store (persisted) as we type.
  useEffect(() => {
    const sub = watch((values) => setForm(values as WizardFormInput));
    return () => sub.unsubscribe();
  }, [watch, setForm]);

  const onSubmit = (values: WizardFormValues) => {
    setForm(values);
    next();
  };

  const req = (e: unknown) => (e ? t("err_required") : null);

  return (
    <form
      id={DETAILS_FORM_ID}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <StepHeading title={t("detailsTitle")} subtitle={t("detailsSubtitle")} />

      <Field label={t("f_title")} error={req(errors.title)}>
        <Input placeholder={t("f_titlePh")} {...register("title")} />
      </Field>

      <div>
        <Label>{t("f_hosts")}</Label>
        <div className="space-y-2">
          {hosts.fields.map((f, i) => (
            <div key={f.id} className="flex gap-2">
              <Input
                placeholder={t("f_hostPh")}
                {...register(`hostNames.${i}.value` as const)}
              />
              {hosts.fields.length > 1 ? (
                <IconButton label={t("remove")} onClick={() => hosts.remove(i)}>
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              ) : null}
            </div>
          ))}
        </div>
        {errors.hostNames ? <ErrText>{t("err_required")}</ErrText> : null}
        <AddButton onClick={() => hosts.append({ value: "" })}>
          {t("addHost")}
        </AddButton>
      </div>

      <Field label={t("f_date")} error={req(errors.eventAt)}>
        <Input type="datetime-local" {...register("eventAt")} />
      </Field>

      <Field label={t("f_venue")} error={req(errors.venueName)}>
        <Input placeholder={t("f_venuePh")} {...register("venueName")} />
      </Field>

      <Field label={t("f_address")}>
        <Input placeholder={t("f_addressPh")} {...register("address")} />
      </Field>

      <Field
        label={t("f_map")}
        error={errors.mapUrl ? t("err_url") : null}
      >
        <Input placeholder={t("f_mapPh")} {...register("mapUrl")} />
      </Field>

      <Field label={t("f_dress")}>
        <Input placeholder={t("f_dressPh")} {...register("dressCode")} />
      </Field>

      <div>
        <Label>{t("f_program")}</Label>
        <div className="space-y-3">
          {program.fields.map((f, i) => (
            <div key={f.id} className="rounded-lg border border-border p-3">
              <div className="flex gap-2">
                <Input
                  className="w-28 shrink-0"
                  placeholder={t("prog_time")}
                  {...register(`program.${i}.time` as const)}
                />
                <Input
                  placeholder={t("prog_title")}
                  {...register(`program.${i}.title` as const)}
                />
                <IconButton
                  label={t("remove")}
                  onClick={() => program.remove(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              </div>
              <Input
                className="mt-2"
                placeholder={t("prog_desc")}
                {...register(`program.${i}.description` as const)}
              />
            </div>
          ))}
        </div>
        <AddButton
          onClick={() => program.append({ time: "", title: "", description: "" })}
        >
          {t("addProgram")}
        </AddButton>
      </div>

      <div>
        <Label>{t("f_contacts")}</Label>
        <div className="space-y-2">
          {contacts.fields.map((f, i) => (
            <div key={f.id} className="flex gap-2">
              <Input
                placeholder={t("c_name")}
                {...register(`contacts.${i}.name` as const)}
              />
              <Input
                placeholder={t("c_phone")}
                {...register(`contacts.${i}.phone` as const)}
              />
              <IconButton
                label={t("remove")}
                onClick={() => contacts.remove(i)}
              >
                <Trash2 className="h-4 w-4" />
              </IconButton>
            </div>
          ))}
        </div>
        <AddButton onClick={() => contacts.append({ name: "", phone: "" })}>
          {t("addContact")}
        </AddButton>
      </div>

      <Field label={t("f_message")}>
        <Textarea placeholder={t("f_messagePh")} {...register("customMessage")} />
      </Field>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | null;
  children: ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {error ? <ErrText>{error}</ErrText> : null}
    </div>
  );
}

function ErrText({ children }: { children: ReactNode }) {
  return <p className="mt-1 text-xs text-red-600">{children}</p>;
}

function AddButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
    >
      <Plus className="h-4 w-4" />
      {children}
    </button>
  );
}

function IconButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground hover:bg-muted"
    >
      {children}
    </button>
  );
}
