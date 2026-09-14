import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import { Sparkles, UploadCloud, X, Image as ImageIcon, CheckCircle } from "lucide-react";

import Input from "../../components/admin/Input";
import Form from "../../components/admin/Form";
import Button from "../../components/admin/Button";
import { Textarea } from "../../components/admin/Textarea";
import FormRow, { FormGrid } from "../../components/admin/FormRow";
import FormHeader from "../../components/admin/FormHeader";
import { useCreateService } from "./useCreateService";
import { useEditService } from "./useEditService";

const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
`;

const DropzoneBox = styled.div`
  border: 2px dashed ${(props) => (props.$hasImage ? "var(--color-brand-400)" : "var(--color-grey-300)")};
  border-radius: var(--border-radius-md);
  padding: 2rem;
  background: var(--color-grey-50);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: var(--color-brand-500);
    background: var(--color-brand-50);
  }

  .upload-icon {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background: var(--color-grey-100);
    color: var(--color-brand-600);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  &:hover .upload-icon {
    transform: scale(1.1);
    background: var(--color-brand-100);
  }

  .upload-text {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;

    .primary {
      font-size: 1.4rem;
      font-weight: 600;
      color: var(--color-grey-800);
    }

    .secondary {
      font-size: 1.2rem;
      color: var(--color-grey-400);
    }
  }
`;

const PreviewWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 28rem;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  border: 1px solid var(--color-grey-200);
  box-shadow: var(--shadow-sm);

  img {
    width: 100%;
    height: 16rem;
    object-fit: cover;
    display: block;
  }

  .remove-btn {
    position: absolute;
    top: 0.8rem;
    right: 0.8rem;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: rgba(239, 68, 68, 0.9);
    color: #ffffff;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
    transition: all 0.2s;

    &:hover {
      background: #dc2626;
      transform: scale(1.1);
    }
  }
`;

function CreateServiceForm({ serviceToEdit = {}, onCloseModal }) {
  const { isCreating, createService } = useCreateService();
  const { isEditing, editService } = useEditService();
  const isWorking = isCreating || isEditing;

  const { id: editId, ...editValues } = serviceToEdit;
  const isEditSession = Boolean(editId);

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isEditSession && serviceToEdit.photoService?.url && !imagePreview) {
      setImagePreview(serviceToEdit.photoService.url);
    }
  }, [isEditSession, serviceToEdit.photoService?.url, imagePreview]);

  const defaultValues = isEditSession
    ? {
        nameService: editValues.nameService || "",
        Unit: editValues.Unit || "",
        priceService: editValues.priceService || "",
        priceDiscount: editValues.priceDiscount || 0,
        summary: editValues.summary || "",
        description: editValues.description || "",
      }
    : {
        nameService: "",
        Unit: "",
        priceService: "",
        priceDiscount: 0,
        summary: "",
        description: "",
      };

  const { register, handleSubmit, reset, getValues, formState, setValue } =
    useForm({
      defaultValues,
    });
  const { errors } = formState;

  function onSubmit(data) {
    if (!isEditSession && !selectedFile) {
      toast.error("Vui lòng tải lên hình ảnh cho dịch vụ nha khoa");
      return;
    }

    const formData = new FormData();
    formData.append("nameService", data.nameService.trim());
    formData.append("Unit", data.Unit.trim());
    formData.append("priceService", String(data.priceService));
    formData.append("priceDiscount", String(data.priceDiscount || 0));
    formData.append("summary", data.summary ? data.summary.trim() : "");
    formData.append("description", data.description ? data.description.trim() : "");

    if (selectedFile) {
      formData.append("photoService", selectedFile);
    }

    if (isEditSession) {
      editService(
        {
          newServiceData: formData,
          id: editId,
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật dịch vụ thành công!");
            handleReset();
            onCloseModal?.();
          },
        }
      );
    } else {
      createService(formData, {
        onSuccess: () => {
          toast.success("Thêm dịch vụ mới thành công!");
          handleReset();
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

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chỉ chọn tệp hình ảnh (JPEG, PNG, WEBP)");
        return;
      }

      if (file.size > 8 * 1024 * 1024) {
        toast.error("Kích thước hình ảnh tối đa là 8MB");
        return;
      }

      setSelectedFile(file);
      setValue("photoService", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  function removeImage(e) {
    e.stopPropagation();
    if (isEditSession && serviceToEdit.photoService?.url) {
      setImagePreview(serviceToEdit.photoService.url);
      setSelectedFile(null);
    } else {
      setImagePreview(null);
      setSelectedFile(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setValue("photoService", null);
  }

  function handleReset() {
    reset(defaultValues);
    setImagePreview(
      isEditSession && serviceToEdit.photoService?.url
        ? serviceToEdit.photoService.url
        : null
    );
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormHeader
        icon={<Sparkles />}
        title={isEditSession ? "Cập nhật dịch vụ nha khoa" : "Thêm dịch vụ nha khoa mới"}
        subtitle="Thiết lập thông tin dịch vụ, đơn vị tính, giá niêm yết và chính sách ưu đãi."
      />

      <FormGrid>
        <FormRow label="Tên dịch vụ nha khoa" required error={errors?.nameService?.message}>
          <Input
            type="text"
            id="nameService"
            placeholder="Ví dụ: Tẩy trắng răng Laser Whitening"
            disabled={isWorking}
            {...register("nameService", {
              required: "Vui lòng nhập tên dịch vụ",
              minLength: {
                value: 2,
                message: "Tên dịch vụ phải có ít nhất 2 ký tự",
              },
            })}
          />
        </FormRow>

        <FormRow label="Đơn vị tính" required error={errors?.Unit?.message}>
          <Input
            type="text"
            id="Unit"
            placeholder="Ví dụ: Liệu trình, Răng, Ca, Gói..."
            disabled={isWorking}
            {...register("Unit", {
              required: "Vui lòng nhập đơn vị tính",
            })}
          />
        </FormRow>
      </FormGrid>

      <FormGrid>
        <FormRow label="Giá dịch vụ (VNĐ)" required error={errors?.priceService?.message}>
          <Input
            type="number"
            id="priceService"
            placeholder="Ví dụ: 1500000"
            disabled={isWorking}
            step="1000"
            {...register("priceService", {
              required: "Vui lòng nhập giá dịch vụ",
              min: {
                value: 1,
                message: "Giá dịch vụ phải lớn hơn 0",
              },
              valueAsNumber: true,
            })}
          />
        </FormRow>

        <FormRow label="Giá khuyến mãi / Ưu đãi (VNĐ)" error={errors?.priceDiscount?.message}>
          <Input
            type="number"
            id="priceDiscount"
            placeholder="Ví dụ: 1200000 (Để 0 nếu không giảm)"
            disabled={isWorking}
            step="1000"
            {...register("priceDiscount", {
              valueAsNumber: true,
              validate: (value) => {
                const servicePrice = getValues().priceService;
                if (value && value < 0) {
                  return "Giá giảm không được âm";
                }
                if (value && servicePrice && Number(value) >= Number(servicePrice)) {
                  return "Giá khuyến mãi phải nhỏ hơn giá gốc";
                }
                return true;
              },
            })}
          />
        </FormRow>
      </FormGrid>

      <FormRow label="Tóm tắt ngắn gọn" error={errors?.summary?.message}>
        <Input
          type="text"
          id="summary"
          placeholder="Mô tả tóm tắt nổi bật (Ví dụ: Công nghệ châu Âu không ê buốt)"
          disabled={isWorking}
          {...register("summary", {
            maxLength: {
              value: 200,
              message: "Tóm tắt không được vượt quá 200 ký tự",
            },
          })}
        />
      </FormRow>

      <FormRow label="Mô tả chi tiết liệu trình" required error={errors?.description?.message}>
        <Textarea
          id="description"
          disabled={isWorking}
          placeholder="Quy trình thực hiện, cam kết chất lượng, bảo hành và lưu ý sau điều trị..."
          rows={4}
          {...register("description", {
            required: "Vui lòng nhập mô tả chi tiết dịch vụ",
            maxLength: {
              value: 1500,
              message: "Mô tả không được vượt quá 1500 ký tự",
            },
          })}
        />
      </FormRow>

      <FormRow label="Hình ảnh đại diện dịch vụ" error={errors?.photoService?.message}>
        <UploadContainer>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
            disabled={isWorking}
          />

          {imagePreview ? (
            <PreviewWrapper>
              <img src={imagePreview} alt="Hình ảnh dịch vụ" />
              <button
                type="button"
                className="remove-btn"
                onClick={removeImage}
                disabled={isWorking}
                title="Gỡ ảnh này"
              >
                <X size={16} />
              </button>
            </PreviewWrapper>
          ) : (
            <DropzoneBox
              type="button"
              onClick={() => fileInputRef.current?.click()}
              $hasImage={Boolean(imagePreview)}
            >
              <div className="upload-icon">
                <UploadCloud size={24} />
              </div>
              <div className="upload-text">
                <span className="primary">Nhấp để tải ảnh lên hoặc kéo thả vào đây</span>
                <span className="secondary">Hỗ trợ PNG, JPG, WEBP (Tối đa 8MB)</span>
              </div>
            </DropzoneBox>
          )}
        </UploadContainer>
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
              : "Đang tạo mới..."
            : isEditSession
            ? "Cập nhật dịch vụ"
            : "Lưu dịch vụ mới"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateServiceForm;
