import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Building2, Sparkles } from "lucide-react";

import Input from "../../components/admin/Input";
import Form from "../../components/admin/Form";
import Button from "../../components/admin/Button";
import { Textarea } from "../../components/admin/Textarea";
import FormRow, { FormGrid } from "../../components/admin/FormRow";
import FormHeader from "../../components/admin/FormHeader";
import Select from "../../components/admin/Select";
import { useCreateFacility } from "./useCreateFacility";
import { useEditFacility } from "./useEditFacility";

const StyledSelect = styled(Select)`
  height: 4.2rem;
`;

function CreateFacilityForm({ facilityToEdit = {}, onCloseModal }) {
  const { isCreating, createFacility } = useCreateFacility();
  const { isEditing, editFacility } = useEditFacility();
  const isWorking = isCreating || isEditing;

  const { _id: editId, ...editValues } = facilityToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isEditSession
      ? {
          ...editValues,
        }
      : {
          city: "TP. Hồ Chí Minh",
          chairCount: 6,
          status: "active",
          workingHours: "08:00 - 20:00 (Thứ 2 - CN)",
          image: "/images/resource/image-1.png",
        },
  });

  const { errors } = formState;

  function onSubmit(data) {
    const formattedData = {
      ...data,
      code: data.code.trim().toUpperCase(),
      chairCount: Number(data.chairCount) || 1,
    };

    if (isEditSession) {
      editFacility(
        { newFacilityData: formattedData, id: editId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    } else {
      createFacility(formattedData, {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      });
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} type={onCloseModal ? "modal" : "regular"}>
      <FormHeader
        icon={Building2}
        title={isEditSession ? "Cập nhật Cơ sở Phòng khám" : "Thêm Cơ sở Phòng khám Mới"}
        subtitle={
          isEditSession
            ? "Chỉnh sửa thông tin chi nhánh, địa chỉ, hotline và trang thiết bị"
            : "Khai báo thông tin chi nhánh phòng khám nha khoa mới vào hệ thống"
        }
        badge={isEditSession ? "Chỉnh sửa" : "Tạo mới"}
      />

      <FormGrid columns={2}>
        <FormRow label="Mã định danh cơ sở (*)" error={errors?.code?.message}>
          <Input
            type="text"
            id="code"
            disabled={isWorking}
            placeholder="VD: CS-Q1, CS-Q7, CS-HN..."
            style={{ textTransform: "uppercase" }}
            {...register("code", {
              required: "Vui lòng nhập mã cơ sở",
              minLength: { value: 2, message: "Mã cơ sở tối thiểu 2 ký tự" },
            })}
          />
        </FormRow>

        <FormRow label="Tên chi nhánh cơ sở (*)" error={errors?.name?.message}>
          <Input
            type="text"
            id="name"
            disabled={isWorking}
            placeholder="VD: Nha khoa Smile - Trụ sở Quận 1"
            {...register("name", {
              required: "Vui lòng nhập tên chi nhánh",
              minLength: { value: 3, message: "Tên chi nhánh tối thiểu 3 ký tự" },
            })}
          />
        </FormRow>
      </FormGrid>

      <FormGrid columns={2}>
        <FormRow label="Tỉnh / Thành phố (*)" error={errors?.city?.message}>
          <StyledSelect
            id="city"
            disabled={isWorking}
            {...register("city", { required: "Vui lòng chọn tỉnh/thành phố" })}
          >
            <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
            <option value="Cần Thơ">Cần Thơ</option>
            <option value="Hải Phòng">Hải Phòng</option>
            <option value="Khác">Khác</option>
          </StyledSelect>
        </FormRow>

        <FormRow label="Địa chỉ chi tiết (*)" error={errors?.address?.message}>
          <Input
            type="text"
            id="address"
            disabled={isWorking}
            placeholder="VD: 120 Hai Bà Trưng, Phường Đa Kao, Quận 1"
            {...register("address", {
              required: "Vui lòng nhập địa chỉ cơ sở",
            })}
          />
        </FormRow>
      </FormGrid>

      <FormGrid columns={2}>
        <FormRow label="Số điện thoại hotline (*)" error={errors?.phoneNumber?.message}>
          <Input
            type="tel"
            id="phoneNumber"
            disabled={isWorking}
            placeholder="VD: 028 7300 1234"
            {...register("phoneNumber", {
              required: "Vui lòng nhập hotline cơ sở",
              minLength: { value: 8, message: "Hotline ít nhất 8 số" },
            })}
          />
        </FormRow>

        <FormRow label="Email liên hệ" error={errors?.email?.message}>
          <Input
            type="email"
            id="email"
            disabled={isWorking}
            placeholder="VD: chinhanh.q1@dentist.com"
            {...register("email")}
          />
        </FormRow>
      </FormGrid>

      <FormGrid columns={3}>
        <FormRow label="Số ghế nha khoa" error={errors?.chairCount?.message}>
          <Input
            type="number"
            id="chairCount"
            min={1}
            disabled={isWorking}
            placeholder="VD: 6"
            {...register("chairCount", {
              min: { value: 1, message: "Số ghế tối thiểu là 1" },
            })}
          />
        </FormRow>

        <FormRow label="Khung giờ hoạt động" error={errors?.workingHours?.message}>
          <Input
            type="text"
            id="workingHours"
            disabled={isWorking}
            placeholder="VD: 08:00 - 20:00 (Thứ 2 - CN)"
            {...register("workingHours")}
          />
        </FormRow>

        <FormRow label="Trạng thái vận hành" error={errors?.status?.message}>
          <StyledSelect id="status" disabled={isWorking} {...register("status")}>
            <option value="active">Đang hoạt động</option>
            <option value="maintenance">Đang bảo trì / Nâng cấp</option>
            <option value="inactive">Tạm ngưng hoạt động</option>
          </StyledSelect>
        </FormRow>
      </FormGrid>

      <FormGrid columns={2}>
        <FormRow label="Người phụ trách / Trưởng chi nhánh">
          <Input
            type="text"
            id="managerName"
            disabled={isWorking}
            placeholder="VD: TS. BS. Nguyễn Thành Long"
            {...register("managerName")}
          />
        </FormRow>

        <FormRow label="Hình ảnh đại diện cơ sở">
          <StyledSelect id="image" disabled={isWorking} {...register("image")}>
            <option value="/images/resource/image-1.png">Cơ sở tiêu chuẩn 1 (Hiện đại - Quận 1)</option>
            <option value="/images/resource/image-2.png">Cơ sở tiêu chuẩn 2 (Phú Mỹ Hưng)</option>
            <option value="/images/resource/image-4.png">Cơ sở tiêu chuẩn 3 (Bình Thạnh)</option>
            <option value="/images/resource/image-5.jpg">Cơ sở tiêu chuẩn 4 (Cầu Giấy)</option>
            <option value="/images/resource/image-7.jpg">Cơ sở tiêu chuẩn 5 (Khu điều trị cao cấp)</option>
            <option value="/images/resource/image-8.png">Cơ sở tiêu chuẩn 6 (Phòng tiểu phẫu)</option>
          </StyledSelect>
        </FormRow>
      </FormGrid>

      <FormRow label="Mô tả trang thiết bị & dịch vụ thế mạnh">
        <Textarea
          id="description"
          rows={3}
          disabled={isWorking}
          placeholder="Mô tả các trang thiết bị hiện đại (CT Cone Beam 3D, Laser, máy tẩy trắng...) và các chuyên khoa thế mạnh của cơ sở..."
          {...register("description")}
        />
      </FormRow>

      <FormRow>
        <Button
          variation="secondary"
          type="button"
          onClick={() => onCloseModal?.()}
          disabled={isWorking}
        >
          Hủy bỏ
        </Button>
        <Button disabled={isWorking}>
          {isWorking
            ? "Đang lưu..."
            : isEditSession
            ? "Cập nhật cơ sở"
            : "Tạo cơ sở mới"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateFacilityForm;
