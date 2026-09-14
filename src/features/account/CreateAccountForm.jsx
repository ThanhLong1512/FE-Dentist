import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ShieldCheck, UserPlus, UserCheck } from "lucide-react";

import Input from "../../components/admin/Input";
import Form from "../../components/admin/Form";
import Button from "../../components/admin/Button";
import Select from "../../components/admin/Select";
import FormRow, { FormGrid } from "../../components/admin/FormRow";
import FormHeader from "../../components/admin/FormHeader";
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

    if (!isEditSession) {
      accountData.password = data.password;
      accountData.passwordConfirm = data.passwordConfirm;
    }

    if (isEditSession) {
      editAccount(
        {
          newAccountData: accountData,
          id: editId,
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật tài khoản thành công!");
            reset();
            onCloseModal?.();
          },
        }
      );
    } else {
      createAccount(accountData, {
        onSuccess: () => {
          toast.success("Tạo tài khoản mới thành công!");
          reset();
          onCloseModal?.();
        },
      });
    }
  }

  function onError(errors) {
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      toast.error(firstError.message);
    }
  }

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Địa chỉ email không đúng định dạng";
    }
    return true;
  }

  function validatePasswordConfirm(value) {
    if (!isEditSession && value !== password) {
      return "Mật khẩu xác nhận không khớp";
    }
    return true;
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormHeader
        icon={isEditSession ? <UserCheck /> : <UserPlus />}
        title={isEditSession ? "Cập nhật tài khoản" : "Tạo tài khoản người dùng"}
        subtitle="Quản lý thông tin đăng nhập và phân quyền truy cập hệ thống phòng khám."
      />

      <FormGrid>
        <FormRow label="Họ và tên chủ tài khoản" required error={errors?.name?.message}>
          <Input
            type="text"
            id="name"
            placeholder="Ví dụ: Nguyễn Văn C"
            disabled={isWorking}
            {...register("name", {
              required: "Vui lòng nhập họ và tên",
              minLength: {
                value: 2,
                message: "Tên phải có ít nhất 2 ký tự",
              },
              maxLength: {
                value: 50,
                message: "Tên không được vượt quá 50 ký tự",
              },
            })}
          />
        </FormRow>

        <FormRow label="Địa chỉ Email (Đăng nhập)" required error={errors?.email?.message}>
          <Input
            type="email"
            id="email"
            placeholder="user@example.com"
            disabled={isWorking}
            {...register("email", {
              required: "Vui lòng nhập email",
              validate: validateEmail,
            })}
          />
        </FormRow>
      </FormGrid>

      {!isEditSession && (
        <FormGrid>
          <FormRow label="Mật khẩu khởi tạo" required error={errors?.password?.message}>
            <Input
              type="password"
              id="password"
              placeholder="Tối thiểu 8 ký tự..."
              disabled={isWorking}
              {...register("password", {
                required: "Vui lòng nhập mật khẩu",
                minLength: {
                  value: 8,
                  message: "Mật khẩu phải có ít nhất 8 ký tự",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: "Mật khẩu phải bao gồm chữ hoa, chữ thường và chữ số",
                },
              })}
            />
          </FormRow>

          <FormRow
            label="Xác nhận mật khẩu"
            required
            error={errors?.passwordConfirm?.message}
          >
            <Input
              type="password"
              id="passwordConfirm"
              placeholder="Nhập lại mật khẩu..."
              disabled={isWorking}
              {...register("passwordConfirm", {
                required: "Vui lòng xác nhận mật khẩu",
                validate: validatePasswordConfirm,
              })}
            />
          </FormRow>
        </FormGrid>
      )}

      <FormRow label="Vai trò / Phân quyền hệ thống" required error={errors?.role?.message}>
        <Select
          id="role"
          disabled={isWorking}
          {...register("role", {
            required: "Vui lòng chọn vai trò",
          })}
          options={[
            { value: "user", label: "Người dùng / Khách hàng (User)" },
            { value: "admin", label: "Quản trị viên hệ thống (Admin)" },
          ]}
        />
      </FormRow>

      <FormRow>
        <Button
          variation="secondary"
          type="button"
          disabled={isWorking}
          onClick={() => {
            onCloseModal?.();
          }}
        >
          Hủy bỏ
        </Button>
        <Button type="submit" disabled={isWorking}>
          {isWorking
            ? isEditSession
              ? "Đang cập nhật..."
              : "Đang tạo..."
            : isEditSession
            ? "Cập nhật tài khoản"
            : "Tạo tài khoản mới"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateAccountForm;
