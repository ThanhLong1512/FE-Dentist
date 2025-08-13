import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Input from "../../components/admin/Input";
import Form from "../../components/admin/Form";
import Button from "../../components/admin/Button";
import FormRow from "../../components/admin/FormRow";
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
        employee: editValues.employee?._id || "",
        DayOfWeek: editValues.DayOfWeek || "Monday",
        StartTime: editValues.StartTime || "",
        EndTime: editValues.EndTime || "",
        isBooked: editValues.isBooked || false,
      }
    : {
        employee: "",
        DayOfWeek: "Monday",
        StartTime: "",
        EndTime: "",
        isBooked: false,
      };

  const { register, handleSubmit, reset, watch, formState } = useForm({
    defaultValues,
  });
  const { errors } = formState;

  const startTime = watch("StartTime");
  const endTime = watch("EndTime");

  function onSubmit(data) {
    const shiftData = {
      employee: data.employee,
      DayOfWeek: data.DayOfWeek,
      StartTime: data.StartTime,
      EndTime: data.EndTime,
      isBooked: data.isBooked === "true" || data.isBooked === true,
    };

    console.log("Submitting shift data:", shiftData);

    if (isEditSession) {
      editShift(
        {
          newShiftData: shiftData,
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
      createShift(shiftData, {
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

  // Validate time logic
  function validateEndTime(value) {
    if (!startTime || !value) return true;

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(value);

    if (endMinutes <= startMinutes) {
      return "End time must be after start time";
    }

    const duration = endMinutes - startMinutes;
    if (duration < 30) {
      return "Shift must be at least 30 minutes long";
    }

    if (duration > 480) {
      // 8 hours
      return "Shift cannot be longer than 8 hours";
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
      <FormRow label="Employee" error={errors?.employee?.message}>
        <select
          id="employee"
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
          {...register("employee", {
            required: "Please select an employee",
          })}
        >
          <option value="">Select an employee...</option>
          {employees.map((employee) => (
            <option key={employee._id} value={employee._id}>
              {employee.name} - {employee.service?.nameService || "No Service"}
            </option>
          ))}
        </select>
      </FormRow>

      <FormRow label="Day of Week" error={errors?.DayOfWeek?.message}>
        <select
          id="DayOfWeek"
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
          {...register("DayOfWeek", {
            required: "Please select a day",
          })}
        >
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>
      </FormRow>

      <FormRow label="Start Time" error={errors?.StartTime?.message}>
        <Input
          type="time"
          id="StartTime"
          disabled={isWorking}
          {...register("StartTime", {
            required: "This field is required",
            validate: {
              businessHours: (value) => {
                const minutes = timeToMinutes(value);
                const startBusiness = 7 * 60; // 7:00 AM
                const endBusiness = 22 * 60; // 10:00 PM

                if (minutes < startBusiness || minutes > endBusiness) {
                  return "Start time must be between 07:00 and 22:00";
                }
                return true;
              },
            },
          })}
        />
      </FormRow>

      <FormRow label="End Time" error={errors?.EndTime?.message}>
        <Input
          type="time"
          id="EndTime"
          disabled={isWorking}
          {...register("EndTime", {
            required: "This field is required",
            validate: {
              businessHours: (value) => {
                const minutes = timeToMinutes(value);
                const startBusiness = 7 * 60; // 7:00 AM
                const endBusiness = 22 * 60; // 10:00 PM

                if (minutes < startBusiness || minutes > endBusiness) {
                  return "End time must be between 07:00 and 22:00";
                }
                return true;
              },
              afterStartTime: validateEndTime,
            },
          })}
        />
      </FormRow>

      <FormRow label="Booking Status" error={errors?.isBooked?.message}>
        <select
          id="isBooked"
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
          {...register("isBooked")}
        >
          <option value={false}>Available</option>
          <option value={true}>Booked</option>
        </select>
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
            ? "Update Shift"
            : "Create Shift"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateShiftForm;
