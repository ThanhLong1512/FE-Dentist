import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Input from "../../components/admin/Input";
import Form from "../../components/admin/Form";
import Button from "../../components/admin/Button";
import { Textarea } from "../../components/admin/Textarea";
import FormRow from "../../components/admin/FormRow";
import { useCreateEmployee } from "./useCreateEmployee";
import { useEditEmployee } from "./useEditEmployee";
import { useServices } from "../services/useServices";

function CreateEmployeeForm({ employeeToEdit = {}, onCloseModal }) {
  const { isCreating, createEmployee } = useCreateEmployee();
  const { isEditing, editEmployee } = useEditEmployee();
  const { services = [] } = useServices();
  const isWorking = isCreating || isEditing;

  const { _id: editId, ...editValues } = employeeToEdit;
  const isEditSession = Boolean(editId);

  const defaultValues = isEditSession
    ? {
        name: editValues.name || "",
        phoneNumber: editValues.phoneNumber || "",
        gender:
          editValues.gender !== undefined ? String(editValues.gender) : "true",
        email: editValues.email || "",
        experience: editValues.experience || "",
        description: editValues.description || "",
        service: editValues.service || "",
      }
    : {
        name: "",
        phoneNumber: "",
        gender: "true",
        email: "",
        experience: "",
        description: "",
        service: "",
      };

  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues,
  });
  const { errors } = formState;

  function onSubmit(data) {
    console.log("Form data:", data);

    const employeeData = {
      name: data.name.trim(),
      phoneNumber: data.phoneNumber.trim(),
      gender: data.gender === "true" || data.gender === true,
      email: data.email.trim().toLowerCase(),
      experience: data.experience?.trim() || "",
      description: data.description?.trim() || "",
      service: data.service || "",
    };

    console.log("Employee data to send:", employeeData);
    console.log(
      "Gender type:",
      typeof employeeData.gender,
      "Value:",
      employeeData.gender
    );

    if (isEditSession) {
      editEmployee(
        {
          newEmployeeData: employeeData,
          id: editId,
        },
        {
          onSuccess: () => {
            handleReset();
            onCloseModal?.();
          },
        }
      );
    } else {
      createEmployee(employeeData, {
        onSuccess: () => {
          handleReset();
          onCloseModal?.();
        },
      });
    }
  }

  function handleReset() {
    reset(defaultValues);
  }

  function onError(errors) {
    console.log("Form errors:", errors);
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      toast.error(firstError.message);
    }
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Employee name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", {
            required: "This field is required",
            minLength: {
              value: 2,
              message: "Employee name must be at least 2 characters",
            },
            maxLength: {
              value: 50,
              message: "Employee name cannot exceed 50 characters",
            },
            validate: {
              noWhitespaceOnly: (value) =>
                value.trim().length > 0 ||
                "Name cannot be empty or only whitespace",
            },
          })}
        />
      </FormRow>

      <FormRow label="Phone number" error={errors?.phoneNumber?.message}>
        <Input
          type="tel"
          id="phoneNumber"
          disabled={isWorking}
          {...register("phoneNumber", {
            required: "This field is required",
            pattern: {
              value: /^[0-9]{10,11}$/,
              message: "Phone number must be 10-11 digits",
            },
          })}
        />
      </FormRow>

      <FormRow label="Gender" error={errors?.gender?.message}>
        <select
          id="gender"
          disabled={isWorking}
          style={{
            width: "100%",
            padding: "0.8rem 1.2rem",
            border: "1px solid #d1d5db",
            borderRadius: "0.5rem",
            fontSize: "1.4rem",
            backgroundColor: isWorking ? "#f9fafb" : "white",
            cursor: isWorking ? "not-allowed" : "pointer",
          }}
          {...register("gender", {
            required: "This field is required",
          })}
        >
          <option value="true">Female</option>
          <option value="false">Male</option>
        </select>
      </FormRow>

      <FormRow label="Email" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isWorking}
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Please enter a valid email address",
            },
          })}
        />
      </FormRow>

      <FormRow label="Experience" error={errors?.experience?.message}>
        <Input
          type="text"
          id="experience"
          disabled={isWorking}
          placeholder="e.g., 5 years in dental practice"
          {...register("experience", {
            maxLength: {
              value: 100,
              message: "Experience cannot exceed 100 characters",
            },
          })}
        />
      </FormRow>

      <FormRow label="Service" error={errors?.service?.message}>
        <select
          id="service"
          disabled={isWorking}
          style={{
            width: "100%",
            padding: "0.8rem 1.2rem",
            border: "1px solid #d1d5db",
            borderRadius: "0.5rem",
            fontSize: "1.4rem",
            backgroundColor: isWorking ? "#f9fafb" : "white",
            cursor: isWorking ? "not-allowed" : "pointer",
          }}
          {...register("service", {
            required: "Please select a service",
          })}
        >
          <option value="">Select a service...</option>
          {services.map((service) => (
            <option key={service._id} value={service._id}>
              {service.nameService || service.name}
            </option>
          ))}
        </select>
      </FormRow>

      <FormRow label="Description" error={errors?.description?.message}>
        <Textarea
          id="description"
          disabled={isWorking}
          rows={4}
          placeholder="Brief description about the employee..."
          {...register("description", {
            maxLength: {
              value: 500,
              message: "Description cannot exceed 500 characters",
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
            ? "Update Employee"
            : "Create Employee"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateEmployeeForm;
