import { useForm } from "react-hook-form";

import Input from "../../components/admin/Input";
import Form from "../../components/admin/Form";
import Button from "../../components/admin/Button";
import { Textarea } from "../../components/admin/Textarea";
import FormRow from "../../components/admin/FormRow";
import { useCreatePatient } from "./useCreatePatient";
import { useEditPatient } from "./useEditPatient";

function CreatePatientForm({ patientToEdit = {}, onCloseModal }) {
  const { isCreating, createPatient } = useCreatePatient();
  const { isEditing, editPatient } = useEditPatient();
  const isWorking = isCreating || isEditing;
  const { _id: editId, ...editValues } = patientToEdit;
  const isEditSession = Boolean(editId);

  const defaultValues = isEditSession
    ? {
        name: editValues.name || "",
        gender: editValues.gender || true,
        yearOfBirth: editValues.yearOfBirth || "",
        phoneNumber: editValues.phoneNumber || "",
        address: editValues.address || "",
      }
    : {
        name: "",
        gender: true,
        yearOfBirth: "",
        phoneNumber: "",
        address: "",
      };

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues,
  });
  const { errors } = formState;

  function onSubmit(data) {
    // Convert gender to boolean: true = male, false = female
    const patientData = {
      ...data,
      gender: data.gender === "true" || data.gender === true,
      yearOfBirth: Number(data.yearOfBirth),
    };

    console.log("Submitting patient data:", patientData);

    if (isEditSession) {
      editPatient(
        {
          newPatientData: patientData,
          id: editId,
        },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    } else {
      createPatient(patientData, {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      });
    }
  }

  function onError(errors) {
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      alert(firstError.message);
    }
  }

  const currentYear = new Date().getFullYear();

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Patient name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", {
            required: "This field is required",
            minLength: {
              value: 2,
              message: "Patient name must be at least 2 characters",
            },
          })}
        />
      </FormRow>

      <FormRow label="Gender" error={errors?.gender?.message}>
        <select
          id="gender"
          disabled={isWorking}
          {...register("gender", {
            required: "This field is required",
          })}
          style={{
            width: "100%",
            padding: "0.8rem 1.2rem",
            border: "1px solid #d1d5db",
            borderRadius: "0.5rem",
            fontSize: "1.4rem",
            backgroundColor: isWorking ? "#f3f4f6" : "white",
          }}
        >
          <option value={true}>Nam</option>
          <option value={false}>Nữ</option>
        </select>
      </FormRow>

      <FormRow label="Year of Birth" error={errors?.yearOfBirth?.message}>
        <Input
          type="number"
          id="yearOfBirth"
          disabled={isWorking}
          {...register("yearOfBirth", {
            required: "This field is required",
            min: {
              value: 1900,
              message: "Year of birth cannot be before 1900",
            },
            max: {
              value: currentYear,
              message: `Year of birth cannot be after ${currentYear}`,
            },
            valueAsNumber: true,
          })}
        />
      </FormRow>

      <FormRow label="Phone number" error={errors?.phoneNumber?.message}>
        <Input
          type="tel"
          id="phoneNumber"
          disabled={isWorking}
          placeholder="e.g., 0123 456 789"
          {...register("phoneNumber", {
            required: "This field is required",
            pattern: {
              value: /^[\d\s\-\+\(\)]+$/,
              message: "Invalid phone number format",
            },
          })}
        />
      </FormRow>

      <FormRow label="Address" error={errors?.address?.message}>
        <Textarea
          id="address"
          disabled={isWorking}
          placeholder="Patient's address"
          rows={3}
          {...register("address", {
            required: "This field is required",
            maxLength: {
              value: 300,
              message: "Address cannot exceed 300 characters",
            },
          })}
        />
      </FormRow>

      <FormRow>
        <Button
          variation="secondary"
          type="button"
          onClick={() => {
            onCloseModal?.();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isWorking}>
          {isWorking
            ? isEditSession
              ? "Updating..."
              : "Creating..."
            : isEditSession
            ? "Update Patient"
            : "Create Patient"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreatePatientForm;
