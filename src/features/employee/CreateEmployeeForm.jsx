import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Stethoscope, UserCheck } from "lucide-react";

import Input from "../../components/admin/Input";
import Form from "../../components/admin/Form";
import Button from "../../components/admin/Button";
import { Textarea } from "../../components/admin/Textarea";
import Select from "../../components/admin/Select";
import FormRow, { FormGrid } from "../../components/admin/FormRow";
import FormHeader from "../../components/admin/FormHeader";
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
        service: editValues.service?._id || editValues.service || "",
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

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues,
  });
  const { errors } = formState;

  function onSubmit(data) {
    const employeeData = {
      name: data.name.trim(),
      phoneNumber: data.phoneNumber.trim(),
      gender: data.gender === "true" || data.gender === true,
      email: data.email.trim().toLowerCase(),
      experience: data.experience ? data.experience.trim() : "",
      description: data.description ? data.description.trim() : "",
      service: data.service || "",
    };

    if (isEditSession) {
      editEmployee(
        {
          newEmployeeData: employeeData,
          id: editId,
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật thông tin nhân sự thành công!");
            reset();
            onCloseModal?.();
          },
        }
      );
    } else {
      createEmployee(employeeData, {
        onSuccess: () => {
          toast.success("Thêm nhân sự mới thành công!");
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

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormHeader
        icon={isEditSession ? <UserCheck /> : <Stethoscope />}
        title={isEditSession ? "Cập nhật hồ sơ nhân sự" : "Thêm nhân sự / Bác sĩ mới"}
        subtitle="Quản lý đội ngũ bác sĩ, chuyên gia và nhân viên phòng khám nha khoa Cheese Dental."
      />

      <FormGrid>
        <FormRow label="Họ và tên nhân sự" required error={errors?.name?.message}>
          <Input
            type="text"
            id="name"
            placeholder="Ví dụ: ThS. BS Nguyễn Văn B"
            disabled={isWorking}
            {...register("name", {
              required: "Vui lòng nhập họ và tên nhân sự",
              minLength: {
                value: 2,
                message: "Tên nhân sự phải có ít nhất 2 ký tự",
              },
              maxLength: {
                value: 60,
                message: "Tên nhân sự không vượt quá 60 ký tự",
              },
            })}
          />
        </FormRow>

        <FormRow label="Số điện thoại" required error={errors?.phoneNumber?.message}>
          <Input
            type="tel"
            id="phoneNumber"
            placeholder="Ví dụ: 0987 654 321"
            disabled={isWorking}
            {...register("phoneNumber", {
              required: "Vui lòng nhập số điện thoại",
              pattern: {
                value: /^[0-9]{9,12}$/,
                message: "Số điện thoại phải từ 9 đến 12 chữ số",
              },
            })}
          />
        </FormRow>
      </FormGrid>

      <FormGrid>
        <FormRow label="Giới tính" required error={errors?.gender?.message}>
          <Select
            id="gender"
            disabled={isWorking}
            {...register("gender", {
              required: "Vui lòng chọn giới tính",
            })}
            options={[
              { value: "false", label: "Nam" },
              { value: "true", label: "Nữ" },
            ]}
          />
        </FormRow>

        <FormRow label="Email liên hệ" required error={errors?.email?.message}>
          <Input
            type="email"
            id="email"
            placeholder="bacsi@cheesedental.vn"
            disabled={isWorking}
            {...register("email", {
              required: "Vui lòng nhập địa chỉ email",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Địa chỉ email không đúng định dạng",
              },
            })}
          />
        </FormRow>
      </FormGrid>

      <FormGrid>
        <FormRow label="Kinh nghiệm chuyên môn" error={errors?.experience?.message}>
          <Input
            type="text"
            id="experience"
            placeholder="Ví dụ: 8 năm chỉnh nha & Implant"
            disabled={isWorking}
            {...register("experience", {
              maxLength: {
                value: 120,
                message: "Kinh nghiệm không vượt quá 120 ký tự",
              },
            })}
          />
        </FormRow>

        <FormRow label="Chuyên khoa / Dịch vụ phụ trách" required error={errors?.service?.message}>
          <Select
            id="service"
            disabled={isWorking}
            {...register("service", {
              required: "Vui lòng chọn chuyên khoa phụ trách",
            })}
          >
            <option value="">-- Chọn dịch vụ phụ trách --</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.nameService || service.name}
              </option>
            ))}
          </Select>
        </FormRow>
      </FormGrid>

      <FormRow label="Tiểu sử / Giới thiệu tóm tắt" error={errors?.description?.message}>
        <Textarea
          id="description"
          disabled={isWorking}
          rows={3}
          placeholder="Giới thiệu quá trình đào tạo, chứng chỉ nha khoa quốc tế, các ca điều trị tiêu biểu..."
          {...register("description", {
            maxLength: {
              value: 600,
              message: "Mô tả không vượt quá 600 ký tự",
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
            : "Lưu nhân sự mới"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateEmployeeForm;
