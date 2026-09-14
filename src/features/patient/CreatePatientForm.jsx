import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { UserPlus, UserCheck } from "lucide-react";

import Input from "../../components/admin/Input";
import Form from "../../components/admin/Form";
import Button from "../../components/admin/Button";
import { Textarea } from "../../components/admin/Textarea";
import Select from "../../components/admin/Select";
import FormRow, { FormGrid } from "../../components/admin/FormRow";
import FormHeader from "../../components/admin/FormHeader";
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
        gender: editValues.gender !== undefined ? String(editValues.gender) : "true",
        yearOfBirth: editValues.yearOfBirth || "",
        phoneNumber: editValues.phoneNumber || "",
        address: editValues.address || "",
      }
    : {
        name: "",
        gender: "true",
        yearOfBirth: "",
        phoneNumber: "",
        address: "",
      };

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues,
  });
  const { errors } = formState;

  function onSubmit(data) {
    const patientData = {
      ...data,
      name: data.name.trim(),
      gender: data.gender === "true" || data.gender === true,
      yearOfBirth: Number(data.yearOfBirth),
      phoneNumber: data.phoneNumber.trim(),
      address: data.address.trim(),
    };

    if (isEditSession) {
      editPatient(
        {
          newPatientData: patientData,
          id: editId,
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật hồ sơ bệnh nhân thành công!");
            reset();
            onCloseModal?.();
          },
        }
      );
    } else {
      createPatient(patientData, {
        onSuccess: () => {
          toast.success("Thêm bệnh nhân mới thành công!");
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

  const currentYear = new Date().getFullYear();

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormHeader
        icon={isEditSession ? <UserCheck /> : <UserPlus />}
        title={isEditSession ? "Cập nhật hồ sơ bệnh nhân" : "Thêm bệnh nhân mới"}
        subtitle="Điền thông tin định danh và liên lạc của bệnh nhân để quản lý hồ sơ khám và lịch hẹn."
      />

      <FormGrid>
        <FormRow label="Họ và tên bệnh nhân" required error={errors?.name?.message}>
          <Input
            type="text"
            id="name"
            placeholder="Ví dụ: Nguyễn Văn A"
            disabled={isWorking}
            {...register("name", {
              required: "Vui lòng nhập họ và tên bệnh nhân",
              minLength: {
                value: 2,
                message: "Tên bệnh nhân phải có ít nhất 2 ký tự",
              },
            })}
          />
        </FormRow>

        <FormRow label="Giới tính" required error={errors?.gender?.message}>
          <Select
            id="gender"
            disabled={isWorking}
            {...register("gender", {
              required: "Vui lòng chọn giới tính",
            })}
            options={[
              { value: "true", label: "Nam" },
              { value: "false", label: "Nữ" },
            ]}
          />
        </FormRow>
      </FormGrid>

      <FormGrid>
        <FormRow label="Năm sinh" required error={errors?.yearOfBirth?.message}>
          <Input
            type="number"
            id="yearOfBirth"
            placeholder="Ví dụ: 1995"
            disabled={isWorking}
            {...register("yearOfBirth", {
              required: "Vui lòng nhập năm sinh",
              min: {
                value: 1900,
                message: "Năm sinh không hợp lệ (từ 1900 trở đi)",
              },
              max: {
                value: currentYear,
                message: `Năm sinh không được vượt quá ${currentYear}`,
              },
              valueAsNumber: true,
            })}
          />
        </FormRow>

        <FormRow label="Số điện thoại" required error={errors?.phoneNumber?.message}>
          <Input
            type="tel"
            id="phoneNumber"
            placeholder="Ví dụ: 0912 345 678"
            disabled={isWorking}
            {...register("phoneNumber", {
              required: "Vui lòng nhập số điện thoại liên hệ",
              pattern: {
                value: /^[\d\s\-\+\(\)]{9,15}$/,
                message: "Số điện thoại không hợp lệ (9-15 chữ số)",
              },
            })}
          />
        </FormRow>
      </FormGrid>

      <FormRow label="Địa chỉ liên hệ" required error={errors?.address?.message}>
        <Textarea
          id="address"
          disabled={isWorking}
          placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
          rows={3}
          {...register("address", {
            required: "Vui lòng nhập địa chỉ bệnh nhân",
            maxLength: {
              value: 300,
              message: "Địa chỉ không vượt quá 300 ký tự",
            },
          })}
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
              : "Đang lưu..."
            : isEditSession
            ? "Cập nhật hồ sơ"
            : "Lưu bệnh nhân mới"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreatePatientForm;
