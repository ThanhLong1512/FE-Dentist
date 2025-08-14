import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Input from "../../components/admin/Input";
import Form from "../../components/admin/Form";
import Button from "../../components/admin/Button";
import FormRow from "../../components/admin/FormRow";
import { useCreateAccount } from "./useCreateAccount";
import { useEditAccount } from "./useEditAccount";

function CreateAccountForm({ accountToEdit = {}, onCloseModal }) {
  const { isCreating, createAccount } = useCreateAccount();
  const { isEditing, editAccount } = useEditAccount();
  const isWorking = isCreating || isEditing;

  const { _id: editId, ...editValues } = accountToEdit;
  const isEditSession = Boolean(editId);

  const defaultValues = isEditSession
    ? {
        name: editValues.name || "",
        email: editValues.email || "",
        role: editValues.role || "user",
        isLocked: editValues.isLocked || false,
        require_2FA: editValues.require_2FA || false,
      }
    : {
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
        role: "user",
        isLocked: false,
        require_2FA: false,
      };

  const { register, handleSubmit, reset, watch, formState } = useForm({
    defaultValues,
  });
  const { errors } = formState;

  const password = watch("password");

  function onSubmit(data) {
    const accountData = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      role: data.role,
      isLocked: data.isLocked === "true" || data.isLocked === true,
      require_2FA: data.require_2FA === "true" || data.require_2FA === true,
    };

    // Only include password fields when creating new account
    if (!isEditSession) {
      accountData.password = data.password;
      accountData.passwordConfirm = data.passwordConfirm;
    }

    console.log("Submitting account data:", accountData);

    if (isEditSession) {
      editAccount(
        {
          newAccountData: accountData,
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
      createAccount(accountData, {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      });
    }
  }

  function onError(errors) {
    console.log("Form errors:", errors);
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      toast.error(firstError.message);
    }
  }

  // Email validation
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return true;
  }

  // Password confirmation validation
  function validatePasswordConfirm(value) {
    if (!isEditSession && value !== password) {
      return "Passwords do not match";
    }
    return true;
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Full Name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", {
            required: "Full name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
            maxLength: {
              value: 50,
              message: "Name cannot exceed 50 characters",
            },
          })}
        />
      </FormRow>

      <FormRow label="Email Address" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isWorking}
          {...register("email", {
            required: "Email is required",
            validate: validateEmail,
          })}
        />
      </FormRow>

      {!isEditSession && (
        <>
          <FormRow label="Password" error={errors?.password?.message}>
            <Input
              type="password"
              id="password"
              disabled={isWorking}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message:
                    "Password must contain uppercase, lowercase and number",
                },
              })}
            />
          </FormRow>

          <FormRow
            label="Confirm Password"
            error={errors?.passwordConfirm?.message}
          >
            <Input
              type="password"
              id="passwordConfirm"
              disabled={isWorking}
              {...register("passwordConfirm", {
                required: "Please confirm your password",
                validate: validatePasswordConfirm,
              })}
            />
          </FormRow>
        </>
      )}

      <FormRow label="Role" error={errors?.role?.message}>
        <select
          id="role"
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
          {...register("role", {
            required: "Please select a role",
          })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </FormRow>

      {/* <FormRow label="Account Status" error={errors?.isLocked?.message}>
        <select
          id="isLocked"
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
          {...register("isLocked")}
        >
          <option value={false}>Active</option>
          <option value={true}>Locked</option>
        </select>
      </FormRow> */}

      {/* <FormRow
        label="Two-Factor Authentication"
        error={errors?.require_2FA?.message}
      >
        <select
          id="require_2FA"
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
          {...register("require_2FA")}
        >
          <option value={false}>Not Required</option>
          <option value={true}>Required</option>
        </select>
      </FormRow> */}

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
            ? "Update Account"
            : "Create Account"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateAccountForm;
