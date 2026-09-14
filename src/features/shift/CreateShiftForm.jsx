import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Clock, CalendarCheck } from "lucide-react";

import Input from "../../components/admin/Input";
import Form from "../../components/admin/Form";
import Button from "../../components/admin/Button";
import Select from "../../components/admin/Select";
import FormRow, { FormGrid } from "../../components/admin/FormRow";
import FormHeader from "../../components/admin/FormHeader";
import { useCreateShift } from "./useCreateShift";
import { useEditShift } from "./useEditShift";
import { useEmployees } from "../employee/useEmployees";

function CreateShiftForm({ shiftToEdit = {}, onCloseModal }) {
  const { isCreating, createShift } = useCreateShift();
  const { isEditing, editShift } = useEditShift();
  const { employees = [] } = useEmployees();
  const isWorking = isCreating || isEditing;

  const { _id: editId, ...editValues } = shiftToEdit;
  const isEditSession = Boolean(editId);

  const defaultValues = isEditSession
    ? {
        employee: editValues.employee?._id || editValues.employee || "",
        DayOfWeek: editValues.DayOfWeek || "Monday",
        StartTime: editValues.StartTime || "",
        EndTime: editValues.EndTime || "",
        isBooked: editValues.isBooked || false,
      }
    : {
        employee: "",
        DayOfWeek: "Monday",
        StartTime: "08:00",
        EndTime: "12:00",
        isBooked: false,
      };

  const { register, handleSubmit, reset, watch, formState } = useForm({
    defaultValues,
  });
  const { errors } = formState;

  const startTime = watch("StartTime");

  function onSubmit(data) {
    const shiftData = {
      employee: data.employee,
      DayOfWeek: data.DayOfWeek,
      StartTime: data.StartTime,
      EndTime: data.EndTime,
      isBooked: data.isBooked === "true" || data.isBooked === true,
    };

    if (isEditSession) {
      editShift(
        {
          newShiftData: shiftData,
          id: editId,
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật ca trực thành công!");
            reset();
            onCloseModal?.();
          },
        }
      );
    } else {
      createShift(shiftData, {
        onSuccess: () => {
          toast.success("Thêm ca trực mới thành công!");
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

  function validateEndTime(value) {
    if (!startTime || !value) return true;

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(value);

    if (endMinutes <= startMinutes) {
      return "Giờ kết thúc phải sau giờ bắt đầu";
    }

    const duration = endMinutes - startMinutes;
    if (duration < 30) {
      return "Ca trực phải kéo dài tối thiểu 30 phút";
    }

    if (duration > 480) {
      return "Ca trực không được kéo dài quá 8 tiếng";
    }

    return true;
  }

  function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormHeader
        icon={isEditSession ? <CalendarCheck /> : <Clock />}
        title={isEditSession ? "Cập nhật ca trực bác sĩ" : "Đăng ký ca trực đơn lẻ"}
        subtitle="Thiết lập thời gian khám chữa bệnh và phân công bác sĩ trong tuần."
      />

      <FormGrid>
        <FormRow label="Bác sĩ phụ trách" required error={errors?.employee?.message}>
          <Select
            id="employee"
            disabled={isWorking}
            {...register("employee", {
              required: "Vui lòng chọn bác sĩ",
            })}
          >
            <option value="">-- Chọn bác sĩ --</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.name} {employee.service?.nameService ? `(${employee.service.nameService})` : ""}
              </option>
            ))}
          </Select>
        </FormRow>

        <FormRow label="Thứ trong tuần" required error={errors?.DayOfWeek?.message}>
          <Select
            id="DayOfWeek"
            disabled={isWorking}
            {...register("DayOfWeek", {
              required: "Vui lòng chọn ngày trong tuần",
            })}
            options={[
              { value: "Monday", label: "Thứ Hai (Monday)" },
              { value: "Tuesday", label: "Thứ Ba (Tuesday)" },
              { value: "Wednesday", label: "Thứ Tư (Wednesday)" },
              { value: "Thursday", label: "Thứ Năm (Thursday)" },
              { value: "Friday", label: "Thứ Sáu (Friday)" },
              { value: "Saturday", label: "Thứ Bảy (Saturday)" },
              { value: "Sunday", label: "Chủ Nhật (Sunday)" },
            ]}
          />
        </FormRow>
      </FormGrid>

      <FormGrid>
        <FormRow label="Giờ bắt đầu" required error={errors?.StartTime?.message}>
          <Input
            type="time"
            id="StartTime"
            disabled={isWorking}
            {...register("StartTime", {
              required: "Vui lòng chọn giờ bắt đầu",
              validate: {
                businessHours: (value) => {
                  const minutes = timeToMinutes(value);
                  const startBusiness = 7 * 60;
                  const endBusiness = 22 * 60;
                  if (minutes < startBusiness || minutes > endBusiness) {
                    return "Giờ bắt đầu phải trong khung làm việc (07:00 - 22:00)";
                  }
                  return true;
                },
              },
            })}
          />
        </FormRow>

        <FormRow label="Giờ kết thúc" required error={errors?.EndTime?.message}>
          <Input
            type="time"
            id="EndTime"
            disabled={isWorking}
            {...register("EndTime", {
              required: "Vui lòng chọn giờ kết thúc",
              validate: {
                businessHours: (value) => {
                  const minutes = timeToMinutes(value);
                  const startBusiness = 7 * 60;
                  const endBusiness = 22 * 60;
                  if (minutes < startBusiness || minutes > endBusiness) {
                    return "Giờ kết thúc phải trong khung làm việc (07:00 - 22:00)";
                  }
                  return true;
                },
                afterStartTime: validateEndTime,
              },
            })}
          />
        </FormRow>
      </FormGrid>

      <FormRow label="Trạng thái ca trực" error={errors?.isBooked?.message}>
        <Select
          id="isBooked"
          disabled={isWorking}
          {...register("isBooked")}
          options={[
            { value: "false", label: "Còn trống (Sẵn sàng tiếp nhận bệnh nhân)" },
            { value: "true", label: "Đã kín lịch / Đã có bệnh nhân đặt" },
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
              : "Đang lưu..."
            : isEditSession
            ? "Cập nhật ca trực"
            : "Đăng ký ca trực"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateShiftForm;
